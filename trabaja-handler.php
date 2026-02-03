<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

define('MAIL_TO', 'contactorrhh@dibiagi.com.ar');
define('MAIL_FROM', 'contactorrhh@dibiagi.com.ar');

$nombre = isset($_POST['nombre']) ? strip_tags(trim($_POST['nombre'])) : '';
$telefono = isset($_POST['telefono']) ? strip_tags(trim($_POST['telefono'])) : '';
$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
$puesto = isset($_POST['puesto']) ? strip_tags(trim($_POST['puesto'])) : '';
$comentarios = isset($_POST['comentarios']) ? strip_tags(trim($_POST['comentarios'])) : '';

if (empty($nombre) || empty($email) || !isset($_FILES['cv'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Por favor completa todos los campos y sube tu CV.']);
    exit();
}

$file = $_FILES['cv'];
$file_name = $file['name'];
$file_size = $file['size'];
$file_tmp = $file['tmp_name'];
$file_type = $file['type'];

// Preparar el mail con adjunto (multipart)
$boundary = md5(time());
$subject = "Nueva Postulación: $puesto - Dibiagi Recursos Humanos";

$headers = "From: Web Dibiagi <" . MAIL_FROM . ">\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

$message = "--$boundary\r\n";
$message .= "Content-Type: text/html; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";

$body = "<h2>Nueva Postulación Laboral</h2>";
$body .= "<p><strong>Nombre:</strong> $nombre</p>";
$body .= "<p><strong>Puesto:</strong> $puesto</p>";
$body .= "<p><strong>Teléfono:</strong> $telefono</p>";
$body .= "<p><strong>Email:</strong> $email</p>";
$body .= "<p><strong>Comentarios:</strong><br>" . nl2br($comentarios) . "</p>";
$message .= $body . "\r\n";

// Adjuntar archivo
if (is_uploaded_file($file_tmp)) {
    $content = file_get_contents($file_tmp);
    $content = chunk_split(base64_encode($content));
    
    $message .= "--$boundary\r\n";
    $message .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
    $message .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $message .= $content . "\r\n";
}

$message .= "--$boundary--";

try {
    if (@mail(MAIL_TO, $subject, $message, $headers)) {
        echo json_encode(['success' => true, 'message' => '¡Postulación enviada con éxito! Mucha suerte.']);
    } else {
        throw new Exception("Error al enviar el mail");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al enviar la postulación. Intenta de nuevo.']);
}
?>

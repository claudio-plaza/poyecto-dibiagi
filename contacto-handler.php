<?php
// ============================================
// FORMULARIO DE CONTACTO - DIBIAGI
// ============================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

define('MAIL_TO', 'consultasweb@dibiagi.com.ar');
define('MAIL_FROM', 'noreply@dibiagi.com.ar');

// Obtener datos
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$nombre = isset($input['nombre']) ? strip_tags(trim($input['nombre'])) : '';
$pais = isset($input['pais']) ? strip_tags(trim($input['pais'])) : '';
$telefono = isset($input['telefono']) ? strip_tags(trim($input['telefono'])) : '';
$email = isset($input['email']) ? filter_var($input['email'], FILTER_SANITIZE_EMAIL) : '';
$mensaje = isset($input['mensaje']) ? strip_tags(trim($input['mensaje'])) : '';

if (empty($nombre) || empty($email) || empty($telefono)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Por favor completa los campos requeridos.']);
    exit();
}

$subject = "Nueva consulta desde la web - Dibiagi Contacto";
$headers = "From: Web Dibiagi <" . MAIL_FROM . ">\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$body = "<h2>Nueva Consulta de Contacto</h2>";
$body .= "<p><strong>Nombre:</strong> $nombre</p>";
$body .= "<p><strong>País:</strong> $pais</p>";
$body .= "<p><strong>Teléfono:</strong> $telefono</p>";
$body .= "<p><strong>Email:</strong> $email</p>";
$body .= "<p><strong>Mensaje:</strong><br>" . nl2br($mensaje) . "</p>";

try {
    $mail_sent = @mail(MAIL_TO, $subject, $body, $headers);
    
    if ($mail_sent) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => '¡Tu mensaje ha sido enviado correctamente! Nos pondremos en contacto pronto.']);
    } else {
        throw new Exception("Error al enviar el mail");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'No se pudo enviar el mensaje. Por favor intenta nuevamente o contáctanos por teléfono.']);
}
?>

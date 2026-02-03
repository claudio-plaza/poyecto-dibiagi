<?php
// ============================================
// ENVÍO DE EMAIL - COTIZACIÓN DIBIAGI
// ============================================
// Usa la función mail() de PHP nativa
// Solo funciona en servidores con mail() habilitado (como Hostinger)

// Configuración de seguridad y CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo aceptar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// ============================================
// CONFIGURACIÓN
// ============================================
define('MAIL_TO', 'consultasweb@dibiagi.com.ar');
define('MAIL_FROM', 'consultasweb@dibiagi.com.ar');
define('MAIL_FROM_NAME', 'Cotización Dibiagi Transporte');

// ============================================

// Función para limpiar datos
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Obtener datos del formulario
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// Validar campos requeridos
$name = isset($input['name']) ? clean_input($input['name']) : '';
$empresa = isset($input['empresa']) ? clean_input($input['empresa']) : '';
$email = isset($input['email']) ? clean_input($input['email']) : '';
$phone = isset($input['phone']) ? clean_input($input['phone']) : '';
$tipoCarga = isset($input['tipoCarga']) ? clean_input($input['tipoCarga']) : '';
$origen = isset($input['origen']) ? clean_input($input['origen']) : '';
$destino = isset($input['destino']) ? clean_input($input['destino']) : '';
$volumen = isset($input['volumen']) ? clean_input($input['volumen']) : '';
$peso = isset($input['peso']) ? clean_input($input['peso']) : '';
$tipoEmbalaje = isset($input['tipoEmbalaje']) ? clean_input($input['tipoEmbalaje']) : '';
$comentario = isset($input['comentario']) ? clean_input($input['comentario']) : '';
$unidad = isset($input['unidad']) ? clean_input($input['unidad']) : '';

// Validaciones
$errors = [];

if (empty($name)) {
    $errors[] = 'El nombre es requerido';
}

if (empty($email)) {
    $errors[] = 'El email es requerido';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'El email no es válido';
}

if (empty($origen)) {
    $errors[] = 'El origen es requerido';
}

if (empty($destino)) {
    $errors[] = 'El destino es requerido';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit();
}

// Preparar el asunto
$subject = "Nueva Solicitud de Cotización - Dibiagi Transporte";

// Crear el cuerpo del email en HTML
$html_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0b224d; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 3px; border-left: 3px solid #e1211b; }
        .field strong { color: #0b224d; display: block; margin-bottom: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; background: #f1f1f1; }
        .badge { display: inline-block; background: #e1211b; color: white; padding: 3px 10px; border-radius: 3px; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🚛 Nueva Solicitud de Cotización</h2>
            <p style='margin:0; opacity: 0.8;'>Cargas Internacionales</p>
        </div>
        <div class='content'>
            <h3 style='color: #0b224d; border-bottom: 2px solid #e1211b; padding-bottom: 10px;'>Datos del Solicitante</h3>
            <div class='field'>
                <strong>👤 Nombre y Apellido:</strong>
                {$name}
            </div>
            <div class='field'>
                <strong>🏢 Empresa:</strong>
                " . (!empty($empresa) ? $empresa : 'No especificada') . "
            </div>
            <div class='field'>
                <strong>📧 Email:</strong>
                <a href='mailto:{$email}'>{$email}</a>
            </div>
            <div class='field'>
                <strong>📱 Teléfono:</strong>
                " . (!empty($phone) ? $phone : 'No proporcionado') . "
            </div>
            
            <h3 style='color: #0b224d; border-bottom: 2px solid #e1211b; padding-bottom: 10px; margin-top: 30px;'>Detalles de la Carga</h3>
            " . (!empty($unidad) ? "
            <div class='field' style='background-color: #fff9e6; border-left-color: #ffc107;'>
                <strong>🚛 UNIDAD ELEGIDA:</strong>
                <span style='font-size: 1.2rem; font-weight: bold; color: #e1211b;'>{$unidad}</span>
            </div>
            " : "") . "
            <div class='field'>
                <strong>📦 Tipo de Carga:</strong>
                <span class='badge'>" . (!empty($tipoCarga) ? $tipoCarga : 'No especificado') . "</span>
            </div>
            <div class='field'>
                <strong>📍 Origen:</strong>
                {$origen}
            </div>
            <div class='field'>
                <strong>🎯 Destino:</strong>
                {$destino}
            </div>
            <div class='field'>
                <strong>📐 Volumen (m³):</strong>
                " . (!empty($volumen) ? $volumen . ' m³' : 'No especificado') . "
            </div>
            <div class='field'>
                <strong>⚖️ Peso:</strong>
                " . (!empty($peso) ? $peso : 'No especificado') . "
            </div>
            <div class='field'>
                <strong>📋 Tipo de Embalaje:</strong>
                " . (!empty($tipoEmbalaje) ? $tipoEmbalaje : 'No especificado') . "
            </div>
            <div class='field'>
                <strong>💬 Comentario:</strong><br>
                " . (!empty($comentario) ? nl2br($comentario) : 'Sin comentarios') . "
            </div>
        </div>
        <div class='footer'>
            Este mensaje fue enviado desde el formulario de cotización de dibiagi.com.ar
        </div>
    </div>
</body>
</html>
";

// Cuerpo en texto plano (fallback)
$text_body = "Nueva Solicitud de Cotización - Dibiagi Transporte\n\n";
$text_body .= "=== DATOS DEL SOLICITANTE ===\n";
$text_body .= "Nombre: {$name}\n";
$text_body .= "Empresa: " . (!empty($empresa) ? $empresa : 'No especificada') . "\n";
$text_body .= "Email: {$email}\n";
$text_body .= "Teléfono: " . (!empty($phone) ? $phone : 'No proporcionado') . "\n\n";
$text_body .= "=== DETALLES DE LA CARGA ===\n";
if (!empty($unidad)) $text_body .= "UNIDAD ELEGIDA: {$unidad}\n";
$text_body .= "Tipo de Carga: " . (!empty($tipoCarga) ? $tipoCarga : 'No especificado') . "\n";
$text_body .= "Origen: {$origen}\n";
$text_body .= "Destino: {$destino}\n";
$text_body .= "Volumen: " . (!empty($volumen) ? $volumen . ' m³' : 'No especificado') . "\n";
$text_body .= "Peso: " . (!empty($peso) ? $peso : 'No especificado') . "\n";
$text_body .= "Tipo de Embalaje: " . (!empty($tipoEmbalaje) ? $tipoEmbalaje : 'No especificado') . "\n\n";
$text_body .= "Comentario:\n" . (!empty($comentario) ? $comentario : 'Sin comentarios') . "\n\n";
$text_body .= "---\nEste mensaje fue enviado desde el formulario de cotización de dibiagi.com.ar";

// Preparar headers
$boundary = md5(time());

$headers = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Construir el mensaje multipart
$email_message = "--{$boundary}\r\n";
$email_message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$email_message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$email_message .= $text_body . "\r\n";
$email_message .= "--{$boundary}\r\n";
$email_message .= "Content-Type: text/html; charset=UTF-8\r\n";
$email_message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$email_message .= $html_body . "\r\n";
$email_message .= "--{$boundary}--";

// Intentar enviar el email usando la función mail() nativa de PHP
try {
    $mail_sent = @mail(MAIL_TO, $subject, $email_message, $headers);

    if ($mail_sent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => '¡Solicitud enviada correctamente! Nos pondremos en contacto pronto con su cotización.'
        ]);

        // Log exitoso (opcional)
        error_log("Cotización enviada correctamente desde: {$email}");
    } else {
        throw new Exception("Error al enviar el email");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar la solicitud. Por favor intenta nuevamente o contáctanos directamente al +54 261 587 3045.'
    ]);

    // Log del error
    error_log("Error enviando cotización: " . $e->getMessage());
}
?>

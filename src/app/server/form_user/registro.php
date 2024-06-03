<?php
// Configuración de encabezados para permitir solicitudes CORS y JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Incluir funciones de validación
include_once '../validaciones/val_all.php';

// Leer el JSON de la solicitud
$json = file_get_contents('php://input');
$params = json_decode($json);

// Verificar si el JSON es válido
if ($params === null) {
    echo json_encode(['error' => 'Invalid or missing JSON payload']);
    exit;
}

// Campos requeridos
$requiredFields = ['nombre_user', 'nombre_compl_user', 'contrasenia', 'email'];
foreach ($requiredFields as $field) {
    if (!isset($params->$field) || empty(trim($params->$field))) {
        echo json_encode(['error' => "Missing or empty field: $field"]);
        exit;
    }
}

// Limpiar y asignar valores
$nombre_user = trim($params->nombre_user);
$nombre_compl_user = trim($params->nombre_compl_user);
$contrasenia = trim($params->contrasenia);
$email = trim($params->email);

// Validar los datos
$errores = [];
if (!validarNombreUsuario($nombre_user)) {
    $errores[] = "El nombre de usuario es inválido.";
}
if (!validarNombreCompleto($nombre_compl_user)) {
    $errores[] = "El nombre completo es inválido.";
}
if (!validarContrasenia($contrasenia)) {
    $errores[] = "La contraseña es inválida.";
}
if (!validarEmail($email)) {
    $errores[] = "El correo electrónico es inválido.";
}

if (count($errores) > 0) {
    echo json_encode(['error' => $errores]);
    exit;
}

try {
    // Conectar a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar si el nombre de usuario ya existe
    $verificarUsuario = $mbd->prepare("SELECT COUNT(*) FROM usuario WHERE nombre_user = :nombre_user");
    $verificarUsuario->bindParam(':nombre_user', $nombre_user);
    $verificarUsuario->execute();
    if ($verificarUsuario->fetchColumn() > 0) {
        echo json_encode(['error' => "El nombre de usuario ya existe."]);
        exit;
    }

    // Iniciar transacción
    $mbd->beginTransaction();

    // Insertar el usuario en la tabla 'usuario'
    $sentenciaUsuario = $mbd->prepare("INSERT INTO usuario (nombre_user, nombre_compl_user, contrasenia) VALUES (:nombre_user, :nombre_compl_user, :contrasenia)");
    $sentenciaUsuario->bindParam(':nombre_user', $nombre_user);
    $sentenciaUsuario->bindParam(':nombre_compl_user', $nombre_compl_user);
    $sentenciaUsuario->bindParam(':contrasenia', $contrasenia);
    $sentenciaUsuario->execute();

    // Insertar el correo en la tabla 'correo'
    $sentenciaCorreo = $mbd->prepare("INSERT INTO correo (email, nombre_user) VALUES (:email, :nombre_user)");
    $sentenciaCorreo->bindParam(':email', $email);
    $sentenciaCorreo->bindParam(':nombre_user', $nombre_user);
    $sentenciaCorreo->execute();

    // Confirmar transacción
    $mbd->commit();

    echo json_encode(['msg' => 'User añadido']);
} catch (PDOException $e) {
    // Revertir transacción en caso de error
    $mbd->rollBack();
    echo json_encode([
        'error' => [
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        ]
    ]);
}
?>

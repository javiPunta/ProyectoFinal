<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Incluir el archivo de validaciones
include_once '../validaciones/val_all.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

if ($params === null) {
    echo json_encode(['error' => 'Invalid or missing JSON payload']);
    exit;
}

// Validación de campos requeridos
$requiredFields = ['nombre_user', 'nombre_compl_user', 'contrasenia', 'email'];
foreach ($requiredFields as $field) {
    if (!isset($params->$field) || empty(trim($params->$field))) {
        echo json_encode(['error' => "Missing or empty field: $field"]);
        exit;
    }
}

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
    // Devolver errores al cliente en formato JSON
    echo json_encode(['error' => $errores]);
    exit;
}

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Inicia una transacción
    $mbd->beginTransaction();

    // Inserta el usuario en la tabla 'usuario'
    $sentenciaUsuario = $mbd->prepare("INSERT INTO usuario (nombre_user, nombre_compl_user, contrasenia) VALUES (:nombre_user, :nombre_compl_user, :contrasenia)");
    $sentenciaUsuario->bindParam(':nombre_user', $nombre_user);
    $sentenciaUsuario->bindParam(':nombre_compl_user', $nombre_compl_user);
    $sentenciaUsuario->bindParam(':contrasenia', $contrasenia);
    $sentenciaUsuario->execute();

    // Inserta el correo en la tabla 'correo'
    $sentenciaCorreo = $mbd->prepare("INSERT INTO correo (email, nombre_user) VALUES (:email, :nombre_user)");
    $sentenciaCorreo->bindParam(':email', $email);
    $sentenciaCorreo->bindParam(':nombre_user', $nombre_user);
    $sentenciaCorreo->execute();

    // Commit de la transacción
    $mbd->commit();

    echo json_encode(['msg' => 'User added successfully']);
} catch (PDOException $e) {
    $mbd->rollBack();
    echo json_encode([
        'error' => [
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        ]
    ]);
}
?>

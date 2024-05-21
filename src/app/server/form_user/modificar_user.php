<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

// Verificar que se recibieron todos los campos necesarios
if (!$params || !isset($params->nombre_user, $params->nombre_compl_user, $params->contrasenia, $params->email)) {
    echo json_encode(['error' => 'Faltan datos para la actualización del usuario']);
    exit;
}

// Datos para la actualización
$nombre_user = $params->nombre_user;
$nombre_compl_user = $params->nombre_compl_user;
$contrasenia = $params->contrasenia;
$email = $params->email;

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Comenzar transacción
    $mbd->beginTransaction();

    // Actualizar usuario
    $queryUsuario = "UPDATE usuario SET nombre_compl_user = :nombre_compl_user, contrasenia = :contrasenia WHERE nombre_user = :nombre_user";
    $stmtUsuario = $mbd->prepare($queryUsuario);
    $stmtUsuario->execute([
        ':nombre_user' => $nombre_user,
        ':nombre_compl_user' => $nombre_compl_user,
        ':contrasenia' => $contrasenia
    ]);

    // Actualizar correo
    $queryCorreo = "UPDATE correo SET email = :email WHERE nombre_user = :nombre_user";
    $stmtCorreo = $mbd->prepare($queryCorreo);
    $stmtCorreo->execute([
        ':email' => $email,
        ':nombre_user' => $nombre_user
    ]);

    // Confirmar cambios
    $mbd->commit();
    
    echo json_encode(['msg' => 'Usuario actualizado exitosamente']);
} catch (PDOException $e) {
// En caso de error, revertir la transacción
$mbd->rollBack();
error_log("Error al actualizar el usuario: " . $e->getMessage());
echo json_encode([
'error' => [
'msg' => $e->getMessage(),
'code' => $e->getCode()
]
]);
} finally {
// Cerrar la conexión a la base de datos
$mbd = null;
}
?>

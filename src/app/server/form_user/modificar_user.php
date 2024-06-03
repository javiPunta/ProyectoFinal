<?php
// Configura los encabezados para permitir solicitudes desde cualquier origen y manejar JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Lee el JSON recibido en la solicitud
$json = file_get_contents('php://input');
$params = json_decode($json);

// Verifica que se recibió el nombre de usuario, ya que es el identificador único
if (!$params || !isset($params->nombre_user)) {
    echo json_encode(['error' => 'El nombre de usuario es requerido']);
    exit;
}

// Datos para la actualización
$nombre_user = $params->nombre_user;
$nombre_compl_user = isset($params->nombre_compl_user) ? trim($params->nombre_compl_user) : null;
$contrasenia = isset($params->contrasenia) ? trim($params->contrasenia) : null;
$email = isset($params->email) ? trim($params->email) : null;

try {
    // Conexión a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener los valores actuales del usuario
    $consulta = $mbd->prepare("SELECT * FROM usuario WHERE nombre_user = :nombre_user");
    $consulta->bindParam(':nombre_user', $nombre_user, PDO::PARAM_STR);
    $consulta->execute();
    $usuarioActual = $consulta->fetch(PDO::FETCH_ASSOC);

    if (!$usuarioActual) {
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit;
    }

    // Actualizar solo los campos proporcionados, manteniendo los valores actuales para los demás
    $nombre_compl_user = $nombre_compl_user ?: $usuarioActual['nombre_compl_user'];
    $contrasenia = $contrasenia ?: $usuarioActual['contrasenia'];

    // Construir la consulta SQL dinámicamente
    $updates = [];
    if (isset($params->nombre_compl_user) && $nombre_compl_user !== $usuarioActual['nombre_compl_user']) {
        $updates[] = "nombre_compl_user = :nombre_compl_user";
    }
    if (isset($params->contrasenia) && $contrasenia !== $usuarioActual['contrasenia']) {
        $updates[] = "contrasenia = :contrasenia";
    }

    // Si no hay actualizaciones para la tabla usuario, devolver un mensaje
    if (empty($updates) && !$email) {
        echo json_encode(['msg' => 'No se ha modificado ningún campo.']);
        exit;
    }

    // Actualizar la tabla usuario si hay cambios
    if (!empty($updates)) {
        $query = "UPDATE usuario SET " . implode(', ', $updates) . " WHERE nombre_user = :nombre_user";
        $sentencia = $mbd->prepare($query);

        // Vincular todos los parámetros
        if (isset($params->nombre_compl_user) && $nombre_compl_user !== $usuarioActual['nombre_compl_user']) {
            $sentencia->bindParam(':nombre_compl_user', $nombre_compl_user);
        }
        if (isset($params->contrasenia) && $contrasenia !== $usuarioActual['contrasenia']) {
            $sentencia->bindParam(':contrasenia', $contrasenia);
        }
        $sentencia->bindParam(':nombre_user', $nombre_user, PDO::PARAM_STR);

        // Ejecutar la sentencia
        $sentencia->execute();
    }

    // Actualizar la tabla correo si hay cambios
    if ($email) {
        $queryCorreo = "UPDATE correo SET email = :email WHERE nombre_user = :nombre_user";
        $stmtCorreo = $mbd->prepare($queryCorreo);
        $stmtCorreo->execute([
            ':email' => $email,
            ':nombre_user' => $nombre_user
        ]);
    }

    echo json_encode(['msg' => 'Usuario actualizado exitosamente']);
} catch (PDOException $e) {
    // Manejo de errores en la base de datos
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

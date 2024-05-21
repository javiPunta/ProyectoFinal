<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");

$host = 'localhost';
$dbname = 'sorteo';
$user = 'root';
$pass = '';

try {
    $pdo->beginTransaction();

    // Actualizar datos en la tabla 'usuario'
    $stmtUsuario = $pdo->prepare("UPDATE usuario SET nombre_compl_user = ?, contrasenia = ? WHERE nombre_user = ?");
    $stmtUsuario->execute([$data->nombre_compl_user, $data->contrasenia, $data->nombre_user]);

    // Actualizar en 'correo'
    $stmtCorreo = $pdo->prepare("UPDATE correo SET email = ? WHERE nombre_user = ?");
    $stmtCorreo->execute([$data->email, $data->nombre_user]);

    // Asumimos que la tienda no cambia, solo actualizamos el teléfono si es necesario
    if ($data->telefono) {
        $stmtTienda = $pdo->prepare("UPDATE tienda SET telefono = ? WHERE id_tienda = ?");
        $stmtTienda->execute([$data->telefono, $id_tienda]);
    }

    // Actualizar en 'juego'
    $stmtJuego = $pdo->prepare("UPDATE juego SET puntos_juego = ?, nombre_juego = ? WHERE nombre_user = ?");
    $stmtJuego->execute([$data->puntos_juego, 'Juego por defecto', $data->nombre_user]);

    // Actualizar en 'encuesta'
    $stmtEncuesta = $pdo->prepare("UPDATE encuesta SET puntos_encuesta = ?, e1 = ?, e2 = ?, e3 = ?, e4 = ?, e5 = ?, e6 = ?, e7 = ? WHERE nombre_user = ?");
    $stmtEncuesta->execute([$data->puntos_encuesta, 'Respuesta1', 'Respuesta2', 'Respuesta3', 'Respuesta4', 'Respuesta5', 'Respuesta6', 'Respuesta7', $data->nombre_user]);

    // Actualizar 'tickets'
    $stmtTickets = $pdo->prepare("UPDATE tickets SET num_ticket = ? WHERE nombre_user = ? AND id_tienda = ?");
    $stmtTickets->execute([$data->num_ticket, $data->nombre_user, $id_tienda]);

    $pdo->commit();

    echo json_encode(['success' => 'Datos del usuario actualizados exitosamente.']);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => ['msg' => $e->getMessage(), 'code' => $e->getCode()]]);
} finally {
    $pdo = null;
}

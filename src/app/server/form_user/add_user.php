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
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        throw new Exception('Los datos recibidos son inválidos.');
    }

    // Iniciar transacción
    $pdo->beginTransaction();

    // Insertar datos en la tabla 'usuario'
    $stmtUsuario = $pdo->prepare("INSERT INTO usuario (nombre_user, nombre_compl_user, contrasenia) VALUES (?, ?, ?)");
    $stmtUsuario->execute([$data->nombre_user, $data->nombre_compl_user, $data->contrasenia]);

    // Insertar en 'correo'
    $stmtCorreo = $pdo->prepare("INSERT INTO correo (email, nombre_user) VALUES (?, ?)");
    $stmtCorreo->execute([$data->email, $data->nombre_user]);

    // Verificar si existe la tienda
    $stmtTiendaExistente = $pdo->prepare("SELECT id_tienda FROM tienda WHERE nombre_tienda = ?");
    $stmtTiendaExistente->execute([$data->nombre_tienda]);
    $tiendaExistente = $stmtTiendaExistente->fetch(PDO::FETCH_ASSOC);

    if ($tiendaExistente) {
        $id_tienda = $tiendaExistente['id_tienda'];
    } else {
        // Insertar en 'tienda' si no existe
        $stmtTienda = $pdo->prepare("INSERT INTO tienda (nombre_tienda, telefono) VALUES (?, ?)");
        $stmtTienda->execute([$data->nombre_tienda, $data->telefono]);
        $id_tienda = $pdo->lastInsertId();
    }

    // Insertar en 'user_tienda'
    $stmtUserTienda = $pdo->prepare("INSERT INTO user_tienda (nombre_user, id_tienda) VALUES (?, ?)");
    $stmtUserTienda->execute([$data->nombre_user, $id_tienda]);

    // Insertar en 'juego'
    $stmtJuego = $pdo->prepare("INSERT INTO juego (nombre_user, puntos_juego, nombre_juego) VALUES (?, ?, ?)");
    $stmtJuego->execute([$data->nombre_user, $data->puntos_juego, 'Juego por defecto']);

    // Insertar en 'encuesta'
    $stmtEncuesta = $pdo->prepare("INSERT INTO encuesta (nombre_user, puntos_encuesta, e1, e2, e3, e4, e5, e6, e7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmtEncuesta->execute([$data->nombre_user, $data->puntos_encuesta, 'Respuesta1', 'Respuesta2', 'Respuesta3', 'Respuesta4', 'Respuesta5', 'Respuesta6', 'Respuesta7']);

    // Insertar en 'tickets'
    $stmtTickets = $pdo->prepare("INSERT INTO tickets (num_ticket, id_tienda, nombre_user) VALUES (?, ?, ?)");
    $stmtTickets->execute([$data->num_ticket, $id_tienda, $data->nombre_user]);

    // Confirmar la transacción
    $pdo->commit();

    echo json_encode(['success' => 'Usuario y datos relacionados agregados exitosamente.']);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => ['msg' => $e->getMessage(), 'code' => $e->getCode()]]);
} finally {
    $pdo = null;
}

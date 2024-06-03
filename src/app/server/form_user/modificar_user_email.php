<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");

$json = file_get_contents('php://input');
$params = json_decode($json, true);

error_log("Received JSON: " . $json);

$required_params = ['nombre_user', 'nombre_compl_user', 'contrasenia', 'email'];
foreach ($required_params as $param) {
    if (!isset($params[$param])) {
        error_log("Missing required parameter: " . $param);
        echo json_encode(['error' => 'Faltan datos para la actualización del usuario']);
        exit;
    }
}

$nombre_user = $params['nombre_user'];
$nombre_compl_user = $params['nombre_compl_user'];
$contrasenia = $params['contrasenia'];
$email = $params['email'];
$nombre_tienda = isset($params['nombre_tienda']) ? $params['nombre_tienda'] : null;
$num_ticket = isset($params['num_ticket']) ? $params['num_ticket'] : null;
$puntos_juego = isset($params['puntos_juego']) ? $params['puntos_juego'] : null;
$puntos_encuesta = isset($params['puntos_encuesta']) ? $params['puntos_encuesta'] : null;

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $mbd->beginTransaction();

    $queryUsuario = "UPDATE usuario SET nombre_compl_user = :nombre_compl_user, contrasenia = :contrasenia WHERE nombre_user = :nombre_user";
    $stmtUsuario = $mbd->prepare($queryUsuario);
    $stmtUsuario->execute([
        ':nombre_user' => $nombre_user,
        ':nombre_compl_user' => $nombre_compl_user,
        ':contrasenia' => $contrasenia
    ]);
    if ($stmtUsuario->rowCount() === 0) {
        error_log("No rows updated in 'usuario' table for nombre_user: $nombre_user");
    }

    $queryCorreo = "UPDATE correo SET email = :email WHERE nombre_user = :nombre_user";
    $stmtCorreo = $mbd->prepare($queryCorreo);
    $stmtCorreo->execute([
        ':email' => $email,
        ':nombre_user' => $nombre_user
    ]);
    if ($stmtCorreo->rowCount() === 0) {
        error_log("No rows updated in 'correo' table for nombre_user: $nombre_user");
    }

    if ($nombre_tienda !== null) {
        $queryTiendaExistente = "SELECT id_tienda FROM tienda WHERE nombre_tienda = :nombre_tienda";
        $stmtTiendaExistente = $mbd->prepare($queryTiendaExistente);
        $stmtTiendaExistente->execute([':nombre_tienda' => $nombre_tienda]);
        $tiendaExistente = $stmtTiendaExistente->fetch(PDO::FETCH_ASSOC);

        if ($tiendaExistente) {
            $id_tienda = $tiendaExistente['id_tienda'];
            $queryUserTienda = "UPDATE user_tienda SET id_tienda = :id_tienda WHERE nombre_user = :nombre_user";
            $stmtUserTienda = $mbd->prepare($queryUserTienda);
            $stmtUserTienda->execute([
                ':id_tienda' => $id_tienda,
                ':nombre_user' => $nombre_user
            ]);
            if ($stmtUserTienda->rowCount() === 0) {
                error_log("No rows updated in 'user_tienda' table for nombre_user: $nombre_user");
            }
        } else {
            $queryInsertTienda = "INSERT INTO tienda (nombre_tienda) VALUES (:nombre_tienda)";
            $stmtInsertTienda = $mbd->prepare($queryInsertTienda);
            $stmtInsertTienda->execute([
                ':nombre_tienda' => $nombre_tienda
            ]);
            $id_tienda = $mbd->lastInsertId();
            $queryUserTienda = "INSERT INTO user_tienda (nombre_user, id_tienda) VALUES (:nombre_user, :id_tienda)";
            $stmtUserTienda = $mbd->prepare($queryUserTienda);
            $stmtUserTienda->execute([
                ':nombre_user' => $nombre_user,
                ':id_tienda' => $id_tienda
            ]);
        }
    }

    if ($num_ticket !== null) {
        $queryTicketExistente = "SELECT id_ticket FROM tickets WHERE nombre_user = :nombre_user";
        $stmtTicketExistente = $mbd->prepare($queryTicketExistente);
        $stmtTicketExistente->execute([':nombre_user' => $nombre_user]);
        $ticketExistente = $stmtTicketExistente->fetch(PDO::FETCH_ASSOC);

        if ($ticketExistente) {
            $queryTickets = "UPDATE tickets SET num_ticket = :num_ticket, id_tienda = :id_tienda WHERE id_ticket = :id_ticket";
            $stmtTickets = $mbd->prepare($queryTickets);
            $stmtTickets->execute([
                ':num_ticket' => $num_ticket,
                ':id_tienda' => $id_tienda ?? null,
                ':id_ticket' => $ticketExistente['id_ticket']
            ]);
        } else {
            $queryInsertTicket = "INSERT INTO tickets (num_ticket, id_tienda, nombre_user) VALUES (:num_ticket, :id_tienda, :nombre_user)";
            $stmtInsertTicket = $mbd->prepare($queryInsertTicket);
            $stmtInsertTicket->execute([
                ':num_ticket' => $num_ticket,
                ':id_tienda' => $id_tienda ?? null,
                ':nombre_user' => $nombre_user
            ]);
        }
    }

    if ($puntos_juego !== null) {
        $queryJuego = "UPDATE juego SET puntos_juego = :puntos_juego WHERE nombre_user = :nombre_user";
        $stmtJuego = $mbd->prepare($queryJuego);
        $stmtJuego->execute([
            ':puntos_juego' => $puntos_juego,
            ':nombre_user' => $nombre_user
        ]);
        if ($stmtJuego->rowCount() === 0) {
            error_log("No rows updated in 'juego' table for nombre_user: $nombre_user");
        }
    }

    if ($puntos_encuesta !== null) {
        $queryEncuesta = "UPDATE encuesta SET puntos_encuesta = :puntos_encuesta WHERE nombre_user = :nombre_user";
        $stmtEncuesta = $mbd->prepare($queryEncuesta);
        $stmtEncuesta->execute([
            ':puntos_encuesta' => $puntos_encuesta,
            ':nombre_user' => $nombre_user
        ]);
        if ($stmtEncuesta->rowCount() === 0) {
            error_log("No rows updated in 'encuesta' table for nombre_user: $nombre_user");
        }
    }

    $mbd->commit();
    echo json_encode(['msg' => 'Usuario actualizado exitosamente']);
} catch (PDOException $e) {
    $mbd->rollBack();
    error_log("Error al actualizar el usuario: " . $e->getMessage());
    echo json_encode([
        'error' => [
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        ]
    ]);
} finally {
    $mbd = null;
}
?>

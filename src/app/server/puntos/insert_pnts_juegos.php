<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

$nombre = $params->apodo;
$puntos = $params->pnts;

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Inicia una transacción
    $mbd->beginTransaction();

    // Preparar y ejecutar la consulta para obtener los puntos actuales del usuario
    $stmt = $mbd->prepare('SELECT puntos_juego FROM juego WHERE nombre_user = :nombre_user');
    $stmt->bindParam(':nombre_user', $nombre);
    $stmt->execute();
    $stmt_result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($stmt_result) {
        $puntosActuales = $stmt_result['puntos_juego'];

        // Verifica si los puntos recibidos son mayores que los que existen
        if ($puntos > $puntosActuales) {
            $consultaActualizarPuntos = $mbd->prepare("UPDATE juego SET puntos_juego = :puntos_juego WHERE nombre_user = :nombre_user");
            $consultaActualizarPuntos->bindParam(':nombre_user', $nombre);
            $consultaActualizarPuntos->bindParam(':puntos_juego', $puntos);
            $consultaActualizarPuntos->execute();
        }
    } else {
        // Si el usuario no tiene registro en la tabla juego, inserta uno nuevo
        $consultaInsertarPuntos = $mbd->prepare("INSERT INTO juego (nombre_user, puntos_juego) VALUES (:nombre_user, :puntos_juego)");
        $consultaInsertarPuntos->bindParam(':nombre_user', $nombre);
        $consultaInsertarPuntos->bindParam(':puntos_juego', $puntos);
        $consultaInsertarPuntos->execute();
    }

    // Si todo fue bien, commit a la transacción
    $mbd->commit();
    echo json_encode(['success' => 'Los puntos han sido actualizados correctamente.']);
} catch (PDOException $e) {
    // Algo salió mal, revertir la transacción
    $mbd->rollBack();
    error_log("Error en la operación de base de datos: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'error' => [
            'msg' => 'Error en la operación de base de datos',
            'code' => $e->getCode(),
            'detail' => $e->getMessage() // Considera omitir detalles en producción
        ]
    ]);
}
?>
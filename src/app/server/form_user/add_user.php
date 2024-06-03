<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");

// Manejo de la solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../validaciones/val_all.php';

$host = 'localhost';
$dbname = 'sorteo';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $data = json_decode(file_get_contents("php://input"), true);

    // Log para verificar los datos recibidos
    error_log(print_r($data, true));

    // Verificar que todos los parámetros obligatorios estén presentes
    if (!$data || !isset($data['nombre_user']) || !isset($data['contrasenia']) || !isset($data['email'])) {
        throw new Exception('Los datos recibidos son inválidos o incompletos.');
    }

    // Validar datos obligatorios
    if (!validarNombreUsuario($data['nombre_user'])) {
        throw new Exception('El nombre de usuario es inválido.');
    }

    if (!validarContrasenia($data['contrasenia'])) {
        throw new Exception('La contraseña es inválida.');
    }

    if (!validarEmail($data['email'])) {
        throw new Exception('El correo electrónico es inválido.');
    }

    // Validar datos opcionales
    if (isset($data['nombre_compl_user']) && !validarNombreCompleto($data['nombre_compl_user'])) {
        throw new Exception('El nombre completo es inválido.');
    }

    if (isset($data['telefono']) && !validarTelefono($data['telefono'])) {
        throw new Exception('El número de teléfono es inválido.');
    }

    if (isset($data['num_ticket']) && !validarNumeroTicket($data['num_ticket'])) {
        throw new Exception('El número de ticket debe tener exactamente 10 dígitos.');
    }

    if (isset($data['puntos_juego']) && !validarNumeroNoNegativo($data['puntos_juego'])) {
        throw new Exception('Los puntos de juego no pueden ser negativos.');
    }

    if (isset($data['puntos_encuesta']) && !validarNumeroNoNegativo($data['puntos_encuesta'])) {
        throw new Exception('Los puntos de la encuesta no pueden ser negativos.');
    }

    if (isset($data['nombre_tienda']) && !validarLongitudCadena($data['nombre_tienda'], 50)) {
        throw new Exception('El nombre de la tienda es demasiado largo.');
    }

    $pdo->beginTransaction();

    // Insertar usuario
    $stmtUsuario = $pdo->prepare("INSERT INTO usuario (nombre_user, nombre_compl_user, contrasenia) VALUES (?, ?, ?)");
    $stmtUsuario->execute([$data['nombre_user'], $data['nombre_compl_user'] ?? null, $data['contrasenia']]);

    // Insertar correo
    $stmtCorreo = $pdo->prepare("INSERT INTO correo (email, nombre_user) VALUES (?, ?)");
    $stmtCorreo->execute([$data['email'], $data['nombre_user']]);

    // Verificar si existe la tienda
    if (isset($data['nombre_tienda'])) {
        $stmtTiendaExistente = $pdo->prepare("SELECT id_tienda FROM tienda WHERE nombre_tienda = ?");
        $stmtTiendaExistente->execute([$data['nombre_tienda']]);
        $tiendaExistente = $stmtTiendaExistente->fetch(PDO::FETCH_ASSOC);

        if ($tiendaExistente) {
            $id_tienda = $tiendaExistente['id_tienda'];
        } else {
            // Insertar en 'tienda' si no existe
            $stmtTienda = $pdo->prepare("INSERT INTO tienda (nombre_tienda, telefono) VALUES (?, ?)");
            $stmtTienda->execute([$data['nombre_tienda'], $data['telefono'] ?? null]);
            $id_tienda = $pdo->lastInsertId();
        }

        // Insertar en 'user_tienda'
        $stmtUserTienda = $pdo->prepare("INSERT INTO user_tienda (nombre_user, id_tienda) VALUES (?, ?)");
        $stmtUserTienda->execute([$data['nombre_user'], $id_tienda]);
    }

    // Insertar en 'juego' (asumiendo valores por defecto para 'nombre_juego')
    $stmtJuego = $pdo->prepare("INSERT INTO juego (nombre_user, puntos_juego, nombre_juego) VALUES (?, ?, ?)");
    $stmtJuego->execute([$data['nombre_user'], $data['puntos_juego'] ?? 0, 'Snake']);

    // Insertar en 'encuesta'
    $stmtEncuesta = $pdo->prepare("INSERT INTO encuesta (nombre_user, puntos_encuesta, e1, e2, e3, e4, e5, e6, e7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmtEncuesta->execute([$data['nombre_user'], $data['puntos_encuesta'] ?? 0, 'Respuesta1', 'Respuesta2', 'Respuesta3', 'Respuesta4', 'Respuesta5', 'Respuesta6', 'Respuesta7']);

    // Insertar en 'tickets'
    if (isset($data['num_ticket'])) {
        $stmtTickets = $pdo->prepare("INSERT INTO tickets (num_ticket, id_tienda, nombre_user) VALUES (?, ?, ?)");
        $stmtTickets->execute([$data['num_ticket'], $id_tienda ?? null, $data['nombre_user']]);
    }

    $pdo->commit();
    echo json_encode(['success' => 'Usuario y datos relacionados agregados exitosamente.']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode(['error' => ['msg' => $e->getMessage(), 'code' => $e->getCode()]]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => ['msg' => $e->getMessage(), 'code' => $e->getCode()]]);
} finally {
    $pdo = null;
}
?>

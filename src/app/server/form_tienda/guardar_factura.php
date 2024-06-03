<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nombre_user']) || !isset($data['num_ticket']) || !isset($data['id_tienda'])) {
    echo json_encode(["error" => "Datos incompletos"]);
    http_response_code(400);
    exit;
}

$nombre_user = $data['nombre_user'];
$num_ticket = intval(preg_replace('/[^0-9]/', '', $data['num_ticket']));
$id_tienda = intval($data['id_tienda']);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sorteo";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Verificar si id_tienda existe en la tabla tienda
$tiendaCheckSql = "SELECT COUNT(*) FROM tienda WHERE id_tienda = ?";
$tiendaCheckStmt = $conn->prepare($tiendaCheckSql);
$tiendaCheckStmt->bind_param("i", $id_tienda);
$tiendaCheckStmt->execute();
$tiendaCheckStmt->bind_result($tiendaCount);
$tiendaCheckStmt->fetch();
$tiendaCheckStmt->close();

if ($tiendaCount == 0) {
    echo json_encode(["error" => "id_tienda no existe en la tabla tienda"]);
    http_response_code(400);
    $conn->close();
    exit;
}

// Verificar si num_ticket ya existe
$ticketCheckSql = "SELECT id_ticket FROM tickets WHERE num_ticket = ?";
$ticketCheckStmt = $conn->prepare($ticketCheckSql);
$ticketCheckStmt->bind_param("i", $num_ticket);
$ticketCheckStmt->execute();
$ticketCheckStmt->bind_result($existing_id_ticket);
$ticketCheckStmt->fetch();
$ticketCheckStmt->close();

if ($existing_id_ticket) {
    // Actualizar el ticket existente
    $sql = "UPDATE tickets SET nombre_user = ?, id_tienda = ? WHERE id_ticket = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sii", $nombre_user, $id_tienda, $existing_id_ticket);
} else {
    // Insertar un nuevo ticket en el primer id disponible
    // Encontrar el primer id_ticket disponible
    $findIdSql = "SELECT MIN(t1.id_ticket + 1) AS next_id FROM tickets t1 LEFT JOIN tickets t2 ON t1.id_ticket + 1 = t2.id_ticket WHERE t2.id_ticket IS NULL";
    $findIdStmt = $conn->prepare($findIdSql);
    $findIdStmt->execute();
    $findIdStmt->bind_result($next_id_ticket);
    $findIdStmt->fetch();
    $findIdStmt->close();

    // Insertar nuevo ticket
    $sql = "INSERT INTO tickets (id_ticket, nombre_user, num_ticket, id_tienda) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isii", $next_id_ticket, $nombre_user, $num_ticket, $id_tienda);
}

if ($stmt->execute()) {
    echo json_encode(["success" => "Factura simplificada guardada correctamente"]);
    http_response_code(200);
} else {
    echo json_encode(["error" => "Error al guardar la factura simplificada"]);
    http_response_code(500);
}

$stmt->close();
$conn->close();
?>

<?php
// Configurar encabezados CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Manejar solicitud OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar datos recibidos
if (!isset($data['nombre_user']) || !isset($data['num_ticket'])) {
    echo json_encode(["error" => "Datos incompletos"]);
    http_response_code(400);
    exit;
}

// Limpiar y validar los datos
$nombre_user = $data['nombre_user'];
$num_ticket = intval(preg_replace('/[^0-9]/', '', $data['num_ticket']));

// Conectar a la base de datos
$servername = "localhost";
$username = "root"; // Tu nombre de usuario de la base de datos
$password = ""; // Tu contraseña de la base de datos
$dbname = "sorteo"; // El nombre de tu base de datos

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Preparar y ejecutar la consulta
$sql = "UPDATE tickets SET num_ticket = ? WHERE nombre_user = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $num_ticket, $nombre_user);

if ($stmt->execute()) {
    echo json_encode(["success" => "Factura simplificada guardada correctamente"]);
    http_response_code(200);
} else {
    echo json_encode(["error" => "Error al guardar la factura simplificada"]);
    http_response_code(500);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>

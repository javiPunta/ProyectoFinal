<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sorteo";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el número de ticket desde el cuerpo de la solicitud
$num_ticket = isset($params->num_ticket) ? $params->num_ticket : '';

// Preparar la consulta
$sql = $conn->prepare("SELECT * FROM tickets WHERE num_ticket = ?");
$sql->bind_param("s", $num_ticket);
$sql->execute();
$result = $sql->get_result();

$response = array();
if ($result->num_rows > 0) {
    // El número de ticket es válido
    $response['valid'] = true;
} else {
    // El número de ticket no es válido
    $response['valid'] = false;
}

// Cerrar la conexión
$sql->close();
$conn->close();

// Enviar la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>

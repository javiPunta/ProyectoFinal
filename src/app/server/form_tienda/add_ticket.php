<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
$host = 'localhost';
$dbname = 'sorteo';
$user = 'root';
$pass = '';

try {
    $mbd = new PDO('mysql:host=' . $host . ';dbname=sorteo' . $dbname, $user, $pass);
    $data = json_decode(file_get_contents("php://input"));
    $numTicket = $data->num_ticket;
    $idTienda = $data->id_tienda;

    // Preparar y ejecutar la sentencia para insertar el ticket
    $stmt = $mbd->prepare("INSERT INTO tickets (num_ticket, id_tienda) VALUES (?, ?)");
    $stmt->execute([$numTicket, $idTienda]);

    echo json_encode(array('success' => 'Ticket guardado con éxito.'));
} catch (PDOException $e) {
    echo json_encode(array('error' => $e->getMessage()));
}

$mbd = null; // Cerrar la conexión a la base de datos
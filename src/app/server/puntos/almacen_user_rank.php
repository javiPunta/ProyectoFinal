<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sorteo";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener el ranking con la puntuación más alta por usuario
$sql = "
    SELECT nombre_user AS username, MAX(puntos_total) AS score
    FROM ranking
    GROUP BY nombre_user
    ORDER BY score DESC
";
$result = $conn->query($sql);

$ranking = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ranking[] = $row;
    }
}

echo json_encode($ranking);

// Cerrar la conexión
$conn->close();
?>

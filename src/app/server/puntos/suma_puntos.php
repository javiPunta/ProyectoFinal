<?php

$servername = "localhost";
$username = "your-username";
$password = "your-password";
$dbname = "sorteo";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Seleccionar todos los usuarios
$sql = "SELECT nombre_user FROM usuario";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $nombre_user = $row["nombre_user"];

        // Obtener la suma de puntos_juego
        $sqlJuego = "SELECT COALESCE(SUM(puntos_juego), 0) AS total_juego FROM juego WHERE nombre_user = ?";
        $stmtJuego = $conn->prepare($sqlJuego);
        $stmtJuego->bind_param("s", $nombre_user);
        $stmtJuego->execute();
        $resultJuego = $stmtJuego->get_result();
        $rowJuego = $resultJuego->fetch_assoc();
        $totalJuego = $rowJuego['total_juego'];

        // Obtener la suma de puntos_encuesta
        $sqlEncuesta = "SELECT COALESCE(SUM(puntos_encuesta), 0) AS total_encuesta FROM encuesta WHERE nombre_user = ?";
        $stmtEncuesta = $conn->prepare($sqlEncuesta);
        $stmtEncuesta->bind_param("s", $nombre_user);
        $stmtEncuesta->execute();
        $resultEncuesta = $stmtEncuesta->get_result();
        $rowEncuesta = $resultEncuesta->fetch_assoc();
        $totalEncuesta = $rowEncuesta['total_encuesta'];

        // Calcular los puntos totales
        $totalPoints = $totalJuego + $totalEncuesta;

        // Actualizar la tabla ranking
        $sqlUpdate = "UPDATE ranking SET puntos_total = ? WHERE nombre_user = ?";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bind_param("is", $totalPoints, $nombre_user);
        $stmtUpdate->execute();
    }
} else {
    echo "No users found in the database.";
}

// Cerrar la conexión
$conn->close();
?>

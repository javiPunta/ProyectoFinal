<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
 
$params = json_decode($json);

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");

    // Preparar la consulta SQL
    $stmt = $mbd->prepare("SELECT * FROM usuario WHERE nombre_user = :nombre_user AND contrasenia = :contrasenia");
    
    $nombre=$params->nombre_user;
    $passwrd=$params->contrasenia;

    $stmt->bindParam(':nombre_user', $nombre);
    $stmt->bindParam(':contrasenia', $passwrd);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    } else {
        // Si no hay filas, la autenticación falló
        echo json_encode(array('error' => 'No se encontraron usuarios con esos datos.'));
    }


    $mbd = null; // Desconectar de la base de datos
} catch (PDOException $e) {
    // Manejo de excepciones
    echo json_encode(array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode())));
}
?>
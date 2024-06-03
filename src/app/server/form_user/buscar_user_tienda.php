<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

try {
    $data = json_decode(file_get_contents("php://input"));
    $nombre_user = $data->nombre_user;

    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $stmt = $mbd->prepare('SELECT * FROM user_tienda WHERE nombre_user = :nombre_user');
    $stmt->bindParam(':nombre_user', $nombre_user);
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($rows) {
        echo json_encode(['tieneTienda' => true]);
    } else {
        echo json_encode(['tieneTienda' => false]);
    }

    $mbd = null; // Desconectar
} catch (PDOException $e) {
    echo json_encode(array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode())));
}
?>

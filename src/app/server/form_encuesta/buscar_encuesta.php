<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");

    $stmt = $mbd->query('SELECT * FROM encuesta');

    if ($stmt) {
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    } else {
        echo json_encode(array('error' => 'Error en la consulta.'));
    }

    $mbd = null; // Desconectar
} catch (PDOException $e) {
    echo json_encode(array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode())));
}
?>



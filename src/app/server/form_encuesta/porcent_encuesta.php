<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");

    $stmt = $mbd->query('
        SELECT 
            SUM(CASE WHEN e1 = "Si" THEN 1 ELSE 0 END) AS e1_si,
            SUM(CASE WHEN e1 = "No" THEN 1 ELSE 0 END) AS e1_no,
            SUM(CASE WHEN e2 = "Si" THEN 1 ELSE 0 END) AS e2_si,
            SUM(CASE WHEN e2 = "No" THEN 1 ELSE 0 END) AS e2_no,
            SUM(CASE WHEN e3 = "Si" THEN 1 ELSE 0 END) AS e3_si,
            SUM(CASE WHEN e3 = "No" THEN 1 ELSE 0 END) AS e3_no,
            SUM(CASE WHEN e4 = "Si" THEN 1 ELSE 0 END) AS e4_si,
            SUM(CASE WHEN e4 = "No" THEN 1 ELSE 0 END) AS e4_no,
            SUM(CASE WHEN e5 = "Si" THEN 1 ELSE 0 END) AS e5_si,
            SUM(CASE WHEN e5 = "No" THEN 1 ELSE 0 END) AS e5_no,
            SUM(CASE WHEN e6 = "Si" THEN 1 ELSE 0 END) AS e6_si,
            SUM(CASE WHEN e6 = "No" THEN 1 ELSE 0 END) AS e6_no,
            SUM(CASE WHEN e7 = "Si" THEN 1 ELSE 0 END) AS e7_si,
            SUM(CASE WHEN e7 = "No" THEN 1 ELSE 0 END) AS e7_no
        FROM encuesta
    ');

    if ($stmt) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } else {
        echo json_encode(array('error' => 'Error en la consulta.'));
    }

    $mbd = null; // Desconectar
} catch (PDOException $e) {
    echo json_encode(array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode())));
}
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

// Asignación de variables desde los parámetros recibidos
$nombre_user = $params->nombre_user ?? null;
$e1 = $params->e1 ?? null;
$e2 = $params->e2 ?? null;
$e3 = $params->e3 ?? null;
$e4 = $params->e4 ?? null;
$e5 = $params->e5 ?? null;
$e6 = $params->e6 ?? null;
$e7 = $params->e7 ?? null;
$puntos_encuesta = 3; // Fijo en 3 puntos por cada encuesta

// Verificar si todos los datos necesarios están presentes
if (!$nombre_user || !$e1 || !$e2 || !$e3 || !$e4 || !$e5 || !$e6 || !$e7) {
    echo json_encode(array('error' => 'Datos incompletos'));
    exit;
}

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $mbd->beginTransaction();

    // Obtener el siguiente id_encuesta
    $stmt = $mbd->query("SELECT MAX(id_encuesta) AS max_id FROM encuesta");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $id_encuesta = $row['max_id'] + 1;

    // Insertar la encuesta
    $stmt = $mbd->prepare("INSERT INTO encuesta (id_encuesta, nombre_user, e1, e2, e3, e4, e5, e6, e7, puntos_encuesta) VALUES (:id_encuesta, :nombre_user, :e1, :e2, :e3, :e4, :e5, :e6, :e7, :puntos_encuesta)");
    $stmt->bindParam(':id_encuesta', $id_encuesta);
    $stmt->bindParam(':nombre_user', $nombre_user);
    $stmt->bindParam(':e1', $e1);
    $stmt->bindParam(':e2', $e2);
    $stmt->bindParam(':e3', $e3);
    $stmt->bindParam(':e4', $e4);
    $stmt->bindParam(':e5', $e5);
    $stmt->bindParam(':e6', $e6);
    $stmt->bindParam(':e7', $e7);
    $stmt->bindParam(':puntos_encuesta', $puntos_encuesta);
    $stmt->execute();

    // Actualizar los puntos del usuario
    $stmt = $mbd->prepare("UPDATE encuesta SET puntos_encuesta = puntos_encuesta + :puntos_encuesta WHERE nombre_user = :nombre_user");
    $stmt->bindParam(':puntos_encuesta', $puntos_encuesta);
    $stmt->bindParam(':nombre_user', $nombre_user);
    $stmt->execute();

    $mbd->commit();

    echo json_encode(array('msg' => 'Encuesta subida y puntos actualizados exitosamente'));
    $mbd = null;
} catch (PDOException $e) {
    if ($mbd) {
        $mbd->rollBack();
    }
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        )
    ));
}
?>

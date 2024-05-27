<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

$nombre_tienda = $params->nombre_tienda;
$telefono = $params->telefono;
$nombre_user = $params->nombre_user; // Asegúrate de recibir también el nombre del usuario

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Encuentra el primer ID de tienda no utilizado
    $consultaID = $mbd->prepare("SELECT MIN(t1.id_tienda + 1) as nextID
                                 FROM tienda t1
                                 LEFT JOIN tienda t2 ON t1.id_tienda + 1 = t2.id_tienda
                                 WHERE t2.id_tienda IS NULL");
    $consultaID->execute();
    $resultadoID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $nextID = $resultadoID['nextID'] ?? 1; // Usar 1 si no se encontraron huecos

    // Iniciar la transacción
    $mbd->beginTransaction();

    // Preparar la sentencia SQL para insertar una nueva tienda
    $sentencia = $mbd->prepare("INSERT INTO tienda (id_tienda, nombre_tienda, telefono) 
    VALUES (:id_tienda, :nombre_tienda, :telefono)");
    $sentencia->bindParam(':id_tienda', $nextID, PDO::PARAM_INT);
    $sentencia->bindParam(':nombre_tienda', $nombre_tienda);
    $sentencia->bindParam(':telefono', $telefono);

    if ($sentencia->execute()) {
        // Insertar en la tabla user_tienda
        $sentenciaUserTienda = $mbd->prepare("INSERT INTO user_tienda (nombre_user, id_tienda) VALUES (:nombre_user, :id_tienda)");
        $sentenciaUserTienda->bindParam(':nombre_user', $nombre_user);
        $sentenciaUserTienda->bindParam(':id_tienda', $nextID, PDO::PARAM_INT);

        if ($sentenciaUserTienda->execute()) {
            // Confirmar la transacción
            $mbd->commit();
            echo json_encode(array('msg' => 'Tienda y relación usuario-tienda añadidas exitosamente', 'id_tienda' => $nextID));
        } else {
            // Revertir la transacción en caso de error
            $mbd->rollBack();
            $errorInfo = $sentenciaUserTienda->errorInfo();
            echo json_encode(array('error' => $errorInfo[2]));
        }
    } else {
        // Revertir la transacción en caso de error
        $mbd->rollBack();
        $errorInfo = $sentencia->errorInfo();
        echo json_encode(array('error' => $errorInfo[2]));
    }
} catch (PDOException $e) {
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        )
    ));
}
?>

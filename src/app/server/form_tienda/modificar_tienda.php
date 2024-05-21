<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

// Verificar que tenemos una ID de tienda y al menos un campo más para modificar
if (isset($params->id_tienda) && $params->id_tienda && count(get_object_vars($params)) > 1) {
    $id_tienda = $params->id_tienda;
    unset($params->id_tienda); // Quitamos la id_tienda del objeto para no intentar actualizarla

    try {
        $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
        $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $mbd->beginTransaction();

        // Construir la consulta SQL dinámicamente
        $query = "UPDATE tienda SET ";
        $updates = [];
        foreach ($params as $key => $value) {
            $updates[] = "$key = :$key";
        }
        $query .= implode(', ', $updates);
        $query .= " WHERE id_tienda = :id_tienda";

        $sentencia = $mbd->prepare($query);

        // Vincular todos los parámetros
        foreach ($params as $key => $value) {
            $sentencia->bindValue(":$key", $value);
        }
        // No te olvides de vincular la ID de la tienda
        $sentencia->bindValue(':id_tienda', $id_tienda);

        // Ejecutar la sentencia
        $sentencia->execute();

        $mbd->commit();
        echo json_encode(array('msg' => 'Tienda actualizada exitosamente'));
    } catch (PDOException $e) {
        $mbd->rollBack();
        echo json_encode(array(
            'error' => array(
                'msg' => $e->getMessage(),
                'code' => $e->getCode()
            )
        ));
    }
} else {
    echo json_encode(array('error' => 'ID de tienda y campos para actualizar son requeridos'));
}
?>

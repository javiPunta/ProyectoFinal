<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

if (!$params) {
    echo json_encode(['error' => 'JSON de entrada inválido']);
    exit;
}

$id_tienda = $params->id_tienda ?? null;

if (!$id_tienda) {
    echo json_encode(['error' => 'El ID de la tienda es requerido']);
    exit;
}

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $mbd->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $mbd->beginTransaction();

    $sentencia = $mbd->prepare("DELETE FROM tienda WHERE id_tienda = :id_tienda");
    $sentencia->bindParam(':id_tienda', $id_tienda, PDO::PARAM_INT);
    $sentencia->execute();

    $mbd->commit();

    echo json_encode(['msg' => 'Tienda borrada exitosamente']);
} catch (PDOException $e) {
    $mbd->rollBack();
    error_log("Error al borrar tienda: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'error' => [
            'msg' => 'Error al borrar la tienda',
            'code' => $e->getCode()
        ]
    ]);
} finally {
    $mbd = null;
}
?>

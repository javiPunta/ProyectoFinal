<?php
// Configura los encabezados para permitir solicitudes desde cualquier origen y manejar JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Lee el JSON recibido en la solicitud
$json = file_get_contents('php://input');
$params = json_decode($json);

// Verifica si el JSON es válido
if (!$params) {
    echo json_encode(['error' => 'JSON de entrada inválido']);
    exit;
}

// Verificar que tenemos una ID de tienda
$id_tienda = $params->id_tienda ?? null;
if (!$id_tienda) {
    echo json_encode(['error' => 'El ID de la tienda es requerido']);
    exit;
}

try {
    // Conexión a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $mbd->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // Iniciar una transacción
    $mbd->beginTransaction();

    // Preparar la sentencia SQL para eliminar la tienda
    $sentencia = $mbd->prepare("DELETE FROM tienda WHERE id_tienda = :id_tienda");
    $sentencia->bindParam(':id_tienda', $id_tienda, PDO::PARAM_INT);
    $sentencia->execute();

    // Confirmar la transacción
    $mbd->commit();

    echo json_encode(['msg' => 'Tienda borrada exitosamente']);
} catch (PDOException $e) {
    // Revertir la transacción en caso de error
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
    // Cerrar la conexión
    $mbd = null;
}
?>

<?php
// Incluye las funciones de validación
include_once '../validaciones/val_all.php';

// Configura los encabezados para permitir solicitudes desde cualquier origen y manejar JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Lee el JSON recibido en la solicitud
$json = file_get_contents('php://input');
$params = json_decode($json);

// Verifica si el JSON es válido
if ($params === null) {
    echo json_encode(['error' => 'Invalid or missing JSON payload']);
    exit;
}

// Verificar que tenemos una ID de tienda
if (!isset($params->id_tienda) || empty($params->id_tienda)) {
    echo json_encode(['error' => 'ID de tienda es requerido']);
    exit;
}

$id_tienda = $params->id_tienda;
unset($params->id_tienda); // Quitamos la id_tienda del objeto para no intentar actualizarla

// Validar los datos
$errores = [];
foreach ($params as $key => $value) {
    $params->$key = trim($value);
}

if (isset($params->nombre_tienda) && !validarNombreTienda($params->nombre_tienda)) {
    $errores[] = "El nombre de la tienda es inválido.";
}
if (isset($params->telefono) && !validarTelefono($params->telefono)) {
    $errores[] = "El número de teléfono es inválido.";
}

if (count($errores) > 0) {
    echo json_encode(['error' => $errores]);
    exit;
}

try {
    // Conexión a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener los valores actuales de la tienda
    $consulta = $mbd->prepare("SELECT * FROM tienda WHERE id_tienda = :id_tienda");
    $consulta->bindParam(':id_tienda', $id_tienda, PDO::PARAM_INT);
    $consulta->execute();
    $tiendaActual = $consulta->fetch(PDO::FETCH_ASSOC);

    if (!$tiendaActual) {
        echo json_encode(['error' => 'Tienda no encontrada']);
        exit;
    }

    // Actualizar solo los campos proporcionados, manteniendo los valores actuales para los demás
    $nombre_tienda = isset($params->nombre_tienda) ? $params->nombre_tienda : $tiendaActual['nombre_tienda'];
    $telefono = isset($params->telefono) ? $params->telefono : $tiendaActual['telefono'];

    // Construir la consulta SQL dinámicamente
    $updates = [];
    if (isset($params->nombre_tienda)) {
        $updates[] = "nombre_tienda = :nombre_tienda";
    }
    if (isset($params->telefono)) {
        $updates[] = "telefono = :telefono";
    }
    $query = "UPDATE tienda SET " . implode(', ', $updates) . " WHERE id_tienda = :id_tienda";

    $sentencia = $mbd->prepare($query);

    // Vincular todos los parámetros
    if (isset($params->nombre_tienda)) {
        $sentencia->bindParam(':nombre_tienda', $nombre_tienda);
    }
    if (isset($params->telefono)) {
        $sentencia->bindParam(':telefono', $telefono);
    }
    $sentencia->bindParam(':id_tienda', $id_tienda, PDO::PARAM_INT);

    // Ejecutar la sentencia
    if ($sentencia->execute()) {
        echo json_encode(['msg' => 'Tienda actualizada exitosamente']);
    } else {
        $errorInfo = $sentencia->errorInfo();
        echo json_encode(['error' => $errorInfo[2]]);
    }
} catch (PDOException $e) {
    // Manejo de errores en la base de datos
    echo json_encode(['error' => [
        'msg' => $e->getMessage(),
        'code' => $e->getCode()
    ]]);
} finally {
    $mbd = null;
}
?>

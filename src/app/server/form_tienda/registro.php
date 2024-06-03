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

// Validación de campos requeridos
$requiredFields = ['nombre_tienda', 'telefono'];
foreach ($requiredFields as $field) {
    if (!isset($params->$field) || empty(trim($params->$field))) {
        echo json_encode(['error' => "Missing or empty field: $field"]);
        exit;
    }
}

$nombre_tienda = trim($params->nombre_tienda);
$telefono = trim($params->telefono);

// Validar los datos
$errores = [];
if (!validarNombreTienda($nombre_tienda)) {
    $errores[] = "El nombre de la tienda es inválido.";
}
if (!validarTelefono($telefono)) {
    $errores[] = "El número de teléfono es inválido.";
}

if (count($errores) > 0) {
    // Devolver errores al cliente en formato JSON
    echo json_encode(['error' => $errores]);
    exit;
}

try {
    // Conexión a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Encuentra el primer ID de tienda no utilizado, empezando desde 1
    $consultaID = $mbd->prepare("SELECT COALESCE(MIN(t1.id_tienda + 1), 1) AS nextID
                                 FROM tienda t1
                                 LEFT JOIN tienda t2 ON t1.id_tienda + 1 = t2.id_tienda
                                 WHERE t2.id_tienda IS NULL AND t1.id_tienda + 1 NOT IN (SELECT id_tienda FROM tienda)");
    $consultaID->execute();
    $resultadoID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $nextID = $resultadoID['nextID'];

    // Preparar la sentencia SQL para insertar una nueva tienda con el ID encontrado o el siguiente disponible
    $sentencia = $mbd->prepare("INSERT INTO tienda (id_tienda, nombre_tienda, telefono) VALUES (:id_tienda, :nombre_tienda, :telefono)");
    $sentencia->bindParam(':id_tienda', $nextID, PDO::PARAM_INT);
    $sentencia->bindParam(':nombre_tienda', $nombre_tienda);
    $sentencia->bindParam(':telefono', $telefono);

    // Ejecutar la inserción y devolver el resultado
    if ($sentencia->execute()) {
        echo json_encode(array('msg' => 'Tienda añadida exitosamente', 'id_tienda' => $nextID));
    } else {
        $errorInfo = $sentencia->errorInfo();
        echo json_encode(array('error' => $errorInfo[2]));
    }
} catch (PDOException $e) {
    // Manejo de errores en la base de datos
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        )
    ));
}
?>

<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

 $json = file_get_contents('php://input');
 $params = json_decode($json);

// // Valida que el JSON entrante tenga las propiedades necesarias
// if (!isset($params->nombre_user, $params->puntos)) {
//     http_response_code(400); // Bad Request
//     echo json_encode(['error' => 'Faltan datos en la entrada JSON.']);
//     exit;
// }

$nombre = $params->apodo;
$puntos = $params->pnts;

try {
    
        $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
        $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        // Inicia una transacción
        $mbd->beginTransaction();
    
        // Preparar y ejecutar la consulta para obtener el id_ranking
        $stmt = $mbd->prepare('SELECT id_ranking, puntos_total FROM ranking WHERE nombre_user = :nombre_user');
        $stmt->bindParam(':nombre_user', $nombre);
        $stmt->execute();
        $stmt_result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($stmt_result) {
            $id = $stmt_result['id_ranking'];
            $puntosActuales = $stmt_result['puntos_total'];
    
            // Verifica si los puntos recibidos son mayores que los que existen
            if ($puntos > $puntosActuales) {
                $consultaActualizarPuntos = $mbd->prepare("UPDATE ranking SET puntos_total = :puntos_total WHERE id_ranking = :id_ranking");
                $consultaActualizarPuntos->bindParam(':id_ranking', $id);
                $consultaActualizarPuntos->bindParam(':puntos_total', $puntos);
                $consultaActualizarPuntos->execute();
            }
        }
    
        // Si todo fue bien, commit a la transacción
        $mbd->commit();
        echo json_encode(['success' => 'Los puntos han sido actualizados correctamente.']);
    
    
} catch (PDOException $e) {
    // Algo salió mal, revertir la transacción
    $mbd->rollBack();
    error_log("Error en la operación de base de datos: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'error' => [
            'msg' => 'Error en la operación de base de datos',
            'code' => $e->getCode(),
            'detail' => $e->getMessage() // Considera omitir detalles en producción
        ]
    ]);
} 
?>
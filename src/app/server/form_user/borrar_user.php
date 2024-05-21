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

$nombre = $params->nombre_user ?? null;

if (!$nombre) {
    echo json_encode(['error' => 'El nombre de usuario es requerido']);
    exit;
}

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $mbd->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // Iniciar transacción
    $mbd->beginTransaction();

    // Borrar de las tablas relacionadas con el usuario
    // El orden es importante para respetar las restricciones de clave foránea
    $tablesToDeleteFrom = [
        'encuesta',    
        'tickets',    
        'ranking',
        'juego',
        'correo',
        'user_tienda',
        'usuario'      
    ];
    
    
    foreach ($tablesToDeleteFrom as $table) {
        $query = "DELETE FROM $table WHERE nombre_user = :nombre_user";
        $sentencia = $mbd->prepare($query);
        $sentencia->bindParam(':nombre_user', $nombre);
        $sentencia->execute();
    }

   // Ahora, eliminamos el usuario y las tablas con CASCADE DELETE se encargan de lo demás.
   $queryUsuario = "DELETE FROM usuario WHERE nombre_user = :nombre_user";
   $sentenciaUsuario = $mbd->prepare($queryUsuario);
   $sentenciaUsuario->bindParam(':nombre_user', $nombre);
   $sentenciaUsuario->execute();
  
   $mbd->commit();

   echo json_encode(['msg' => 'Usuario y registros relacionados eliminados exitosamente.']);
} catch (PDOException $e) {
     // Revertir la transacción en caso de error
     $mbd->rollBack();
     error_log("Error al borrar datos del usuario: " . $e->getMessage());
 
     http_response_code(500);
     echo json_encode([
         'error' => [
             'msg' => 'Error al borrar los datos del usuario y registros relacionados',
             'code' => $e->getCode(),
             'detail' => $e->getMessage()
         ]
     ]);
 } finally {
     $mbd = null;
 }

?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

try {
    // Conectar a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener los datos de la solicitud POST
    $data = json_decode(file_get_contents('php://input'), true);
    $nombre_user = isset($data['nombre_user']) ? $data['nombre_user'] : '';

    if (!empty($nombre_user)) {
        // Preparar la consulta para obtener el nombre de la tienda del usuario
        $stmt = $mbd->prepare('SELECT tienda.nombre_tienda 
                               FROM tienda 
                               JOIN user_tienda ON tienda.id_tienda = user_tienda.id_tienda 
                               WHERE user_tienda.nombre_user = :nombre_user');
        $stmt->bindParam(':nombre_user', $nombre_user, PDO::PARAM_STR);
        
        // Ejecutar la consulta
        $stmt->execute();

        // Obtener el resultado
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            echo json_encode($rows[0]); // Suponiendo que un usuario pertenece a una sola tienda
        } else {
            echo json_encode(array('error' => 'No se encontró ninguna tienda para el usuario.'));
        }
    } else {
        echo json_encode(array('error' => 'Datos incompletos.'));
    }

    // Desconectar
    $mbd = null;
} catch (PDOException $e) {
    echo json_encode(array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode())));
}
?>

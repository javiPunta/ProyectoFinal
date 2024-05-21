<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

try {
    $mbd = new PDO('mysql:host=localhost;dbname=sorteo', "root", "");

    // Consulta utilizando alias y simplificando las uniones
    $stmt = $mbd->query('
        SELECT 
            u.nombre_user AS nombre_user, 
            c.email AS email,
            u.nombre_compl_user AS nombre_compl_user,
            u.contrasenia AS contrasenia,
            t.nombre_tienda AS nombre_tienda,
            t.telefono AS telefono,
            ti.num_ticket AS num_ticket,
            j.puntos_juego AS puntos_juego,
            e.puntos_encuesta AS puntos_encuesta
        FROM 
            usuario u
        LEFT JOIN 
            correo c ON u.nombre_user = c.nombre_user
        LEFT JOIN 
            user_tienda ut ON u.nombre_user = ut.nombre_user
        LEFT JOIN 
            tienda t ON ut.id_tienda = t.id_tienda
        LEFT JOIN 
            tickets ti ON u.nombre_user = ti.nombre_user
        LEFT JOIN 
            juego j ON u.nombre_user = j.nombre_user
        LEFT JOIN 
            encuesta e ON u.nombre_user = e.nombre_user
        GROUP BY 
            u.nombre_user
    ');

    if ($stmt) {
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    } else {
        echo json_encode(array('error' => 'Error en la consulta.'));
    }

    $mbd = null; // Desconectar
} catch (PDOException $e) {
    echo json_encode(array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode())));
}

<?php
function validarNombreUsuario($nombre_user) {
    // Verifica que el nombre de usuario solo contenga letras y números y tenga entre 3 y 50 caracteres
    return preg_match('/^[a-zA-Z0-9]{3,50}$/', $nombre_user);
}

function validarNombreCompleto($nombre_compl) {
    // Verifica que el nombre completo solo contenga letras y espacios y tenga entre 3 y 60 caracteres
    return preg_match('/^[a-zA-Z\s]{3,60}$/', $nombre_compl);
}

function validarContrasenia($contrasenia) {
    // Verifica que la contraseña tenga al menos 8 caracteres, incluyendo al menos una letra mayúscula, una minúscula y un número
    return preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}$/', $contrasenia);
}

function validarEmail($email) {
    // Verifica que el correo electrónico tenga un formato válido y no exceda los 60 caracteres
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false && strlen($email) <= 60;
}

function validarTelefono($telefono) {
    // Verifica que el teléfono tenga un formato válido (nacional e internacional)
    return preg_match('/^(\+\d{1,3})?[-.\s]?(\(?\d{1,4}?\))?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/', $telefono);
}

function validarNumeroNoNegativo($numero) {
    // Verifica que el número no sea negativo
    return is_numeric($numero) && $numero >= 0;
}

function validarLongitudCadena($cadena, $longitudMaxima) {
    // Verifica que la longitud de la cadena no exceda la longitud máxima
    return strlen($cadena) <= $longitudMaxima;
}

function validarNumeroTicket($num_ticket) {
    // Verifica que el número de ticket tenga exactamente 10 dígitos
    return preg_match('/^\d{10}$/', $num_ticket);
}
function validarNombreTienda($nombre_tienda) {
    // Verifica que el nombre de la tienda solo contenga letras, números y espacios, y tenga entre 4 y 50 caracteres
    return preg_match('/^[a-zA-Z0-9\s]{4,50}$/', $nombre_tienda);
}
?>

<?php
function validarNombreUsuario($nombre) {
    // Verifica que el nombre de usuario solo contenga letras y números y tenga entre 3 y 20 caracteres
    return preg_match('/^[a-zA-Z0-9]{3,20}$/', $nombre);
}

function validarNombreCompleto($nombre_compl) {
    // Verifica que el nombre completo solo contenga letras y espacios y tenga entre 3 y 50 caracteres
    return preg_match('/^[a-zA-Z\s]{3,50}$/', $nombre_compl);
}

function validarContrasenia($contrasenia) {
    // Verifica que la contraseña tenga al menos 8 caracteres, incluyendo al menos una letra y un número
    return preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/', $contrasenia);
}

function validarEmail($email) {
    // Verifica que el correo electrónico tenga un formato válido
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
?>

<?php
$contraseña = "12345678";
$usuario = "pablo";
$nombre_base_de_datos = "game_community";
try {
    return new PDO('mysql:host=localhost;dbname=' . $nombre_base_de_datos, $usuario, $contraseña);
} catch (Exception $e) {
    echo "Ocurrió algo con la base de datos: " . $e->getMessage();
}

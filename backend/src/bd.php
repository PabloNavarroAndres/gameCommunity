<?php

class BD {

    public static function getBD() {
        try {
            return new PDO('mysql:host=localhost;dbname=' . "game_community", "pablo", "12345678");
        } catch (Exception $e) {
            echo "Ocurrió algo con la base de datos: " . $e->getMessage();
        }
    }
}
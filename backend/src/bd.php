<?php

class BD {

    public static function getBD() {
        try {
            return new PDO('mysql:host=localhost;dbname=' . "gaming_community", "root", "");
        } catch (Exception $e) {
            echo "Ocurrió algo con la base de datos: " . $e->getMessage();
        }
    }
}
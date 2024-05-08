<?php

require_once "bd.php";
require_once 'app/models/model/game.model.php';

class GameRepository {

    private $bd;

    public function __construct() {
        $this->bd = BD::getBD();
    }


    public function obtenerVideojuegos() {
        try {

            // Consulta para obtener todos los videojuegos
            $sql = $this->bd->query("SELECT * FROM Games");

            // Datos obtenidos del SQL, como un array asociativo
            $gamesData = $sql->fetchAll(PDO::FETCH_ASSOC); 

            // Crear objetos Game a partir de los datos
            $games = [];
            foreach ($gamesData as $gameData) {
                $game = new Game(
                    $gameData['game_id'],
                    $gameData['title'],
                    $gameData['image']
                );
                $games[] = $game;
            }

            return $games;

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener videojuegos: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

}

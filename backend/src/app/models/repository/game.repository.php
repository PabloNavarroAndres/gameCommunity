<?php

require_once "bd.php";
require_once 'app/models/model/game.model.php';

class GameRepository {

    private $bd;

    public function __construct() {
        $this->bd = BD::getBD();
    }


    public function obtenerVideojuegos($email) {
        try {

            // Consulta para obtener todos los videojuegos que no tenga
            // ya agregados el usuario iniciado
            $sql = $this->bd->prepare(
                "SELECT *
                FROM Games
                WHERE game_id NOT IN (
                    SELECT game_id
                    FROM User_games
                    WHERE user_email = ?
                );"
            );

            // Ejecutar la consulta preparada
            $sql->execute([$email]);

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

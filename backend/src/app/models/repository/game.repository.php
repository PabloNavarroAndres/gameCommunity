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

            // Consulta para obtener todos los videojuegos que no tenga
            // ya agregados el usuario iniciado
            $sql = $this->bd->query(
                "SELECT * FROM Games"
            );

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

    public function obtenerVideojuegosUsuario($email) {
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

    public function crearVideojuego($title, $image) {
        try {
            
            $uploadDir = __DIR__ . '/../../../../../frontend/src/assets/juegos/';
            $uploadFile = $uploadDir . basename($image['name']);

            // Mover el archivo subido a la carpeta de destino
            if (move_uploaded_file($image['tmp_name'], $uploadFile)) {

                // Guardar los datos en la base de datos
                $imagenNombre = $image['name'];
                
                // Inserción en la base de datos
                $query = $this->bd->prepare(
                    "INSERT INTO Games (title, image) VALUES (?, ?)
                ");

                $queryDone = $query->execute([$title, $imagenNombre]);

                if ($queryDone == false) {
                    
                    // Eliminar el archivo subido en caso de error de base de datos
                    unlink($uploadFile);
                    http_response_code(500);
                    throw new Exception("Error al insertar imagen en la base de datos");
                }

            } else {
                http_response_code(500);
                throw new Exception("Error al mover el archivo");
            }
            

        } catch (PDOException $e) {
            // Manejar la excepción
            throw new Exception("Error al crear videojuego: " . $e->getMessage());
        }
    }

}

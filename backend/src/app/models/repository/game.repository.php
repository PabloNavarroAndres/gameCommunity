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
            
            $uploadDir = __DIR__ . '/../../../../imgs/games/';
            $uploadFile = $uploadDir . basename($image['name']);

            // Asegúrate de que la carpeta de destino existe
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }


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

    public function eliminarVideojuego($game_id) {
        try {
            // Iniciar la transacción
            $this->bd->beginTransaction();

            // Obtener el nombre de la imagen del videojuego
            $getImageQuery = "SELECT image FROM Games WHERE game_id = ?";
            $stmt = $this->bd->prepare($getImageQuery);
            $stmt->execute([$game_id]);
            $game = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$game) {
                throw new Exception("Videojuego no encontrado");
            }

            $imageName = $game['image'];
            $uploadDir = __DIR__ . '/../../../../imgs/games/';
            $imagePath = $uploadDir . $imageName;
    
            // Actualizar el total de juegos para cada usuario
            $updateTotalGamesQuery = (
                "UPDATE Users u
                JOIN User_games ug ON u.email = ug.user_email
                SET u.total_games = u.total_games - 1
                WHERE ug.game_id = ?"
            );
            $stmt = $this->bd->prepare($updateTotalGamesQuery);
            $stmt->execute([$game_id]);
    
            // Actualizar el contador de juegos deseados
            $updateDesiredGamesQuery = (
                "UPDATE Users u
                JOIN User_games ug ON u.email = ug.user_email
                SET u.desired_games = u.desired_games - 1
                WHERE ug.game_id = ? AND ug.status = 'Lista de deseos'"
            );
            $stmt = $this->bd->prepare($updateDesiredGamesQuery);
            $stmt->execute([$game_id]);
    
            // Actualizar el contador de juegos terminados
            $updateFinishedGamesQuery = (
                "UPDATE Users u
                JOIN User_games ug ON u.email = ug.user_email
                SET u.finished_games = u.finished_games - 1
                WHERE ug.game_id = ? AND ug.status = 'Terminado'"
            );
            $stmt = $this->bd->prepare($updateFinishedGamesQuery);
            $stmt->execute([$game_id]);
    
            // Eliminar las referencias en User_games
            $deleteUserGamesQuery = "DELETE FROM User_games WHERE game_id = ?";
            $stmt = $this->bd->prepare($deleteUserGamesQuery);
            $stmt->execute([$game_id]);
    
            // Eliminar el juego en Games
            $deleteGameQuery = "DELETE FROM Games WHERE game_id = ?";
            $stmt = $this->bd->prepare($deleteGameQuery);
            $stmt->execute([$game_id]);
    
            // Confirmar la transacción
            $this->bd->commit();

            // Eliminar la imagen del sistema de archivos
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            $this->bd->rollBack();
            throw new Exception("Error al eliminar videojuego: " . $e->getMessage(), 0, $e);
        }
    }
    
    

}

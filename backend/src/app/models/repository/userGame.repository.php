<?php

require_once "bd.php";
require_once 'app/models/model/userGame.model.php';

class UserGameRepository {

    private $bd;

    public function __construct() {
        $this->bd = BD::getBD();
    }


    public function obtenerVideojuegosUsuario() {
        try {

            // Obtenemos el email que se ha pasado como parametro
            $email = $_GET['email'];

            // Consulta para obtener los datos de User_games y Games
            $sql = $this->bd->prepare("SELECT G.game_id, UG.user_email, G.title, G.image, UG.status, UG.personal_comment, UG.rating 
                               FROM User_games UG
                               JOIN Games G ON UG.game_id = G.game_id
                               WHERE UG.user_email = ?"
            );
            $sql->execute(array($email));

            // Datos obtenidos del SQL, como un array asociativo
            $userGamesData = $sql->fetchAll(PDO::FETCH_ASSOC);

            // Crear objetos Game a partir de los datos
            $userGames = [];
            foreach ($userGamesData as $userGameData) {
                $userGame = new UserGame(
                    $userGameData['game_id'],
                    $userGameData['user_email'],
                    $userGameData['title'],
                    $userGameData['image'],
                    $userGameData['status'],
                    $userGameData['personal_comment'],
                    $userGameData['rating']
                );
                $userGames[] = $userGame;
            }

            return $userGames;

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener videojuegos del usuario: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

    public function agregarVideojuegoUsuario($data) {
        try {

            // Comenzar la transacción
            $this->bd->beginTransaction();

            // Insertar datos en la base de datos
            $game_id = $data['game_id'];
            $user_email = $data['user_email'];

            // Query para agregar el juego de usuario
            $queryInsert = $this->bd->prepare(
                "INSERT INTO User_games 
                (game_id, user_email) 
                VALUES (?, ?)"
            );

            $queryInsert->execute([$game_id, $user_email]);


            // Query para actualizar el contador total_games
            $sqlUpdateTotalGames = $this->bd->prepare(
                "UPDATE Users SET total_games = total_games + 1 WHERE email = ?"
            );

            $sqlUpdateTotalGames->execute([$user_email]);            


            // Confirmar la transacción
            $this->bd->commit();

        } catch (Exception $e) {
            // Si ocurre un error, revertir la transacción
            $this->bd->rollBack();

            // Manejar la excepción
            echo json_encode(array('Error al insertar videojuego de usuario' => $e->getMessage()));
        }
    }

    public function eliminarVideojuegoUsuario($data) {
        try {
            // Comenzar la transacción
            $this->bd->beginTransaction();
        
            // Obtener los datos del juego de usuario a eliminar
            $game_id = $data['game_id'];
            $user_email = $data['user_email'];
        
            // Query para eliminar el juego de usuario
            $queryDelete = $this->bd->prepare(
                "DELETE FROM User_games WHERE game_id = ? AND user_email = ?"
            );
        
            $queryDelete->execute([$game_id, $user_email]);
        
            // Query para actualizar el contador total_games
            $sqlUpdateTotalGames = $this->bd->prepare(
                "UPDATE Users SET total_games = total_games - 1 WHERE email = ?"
            );

            $sqlUpdateTotalGames->execute([$user_email]);
        
            // Confirmar la transacción
            $this->bd->commit();
        
            // Devolver algún tipo de confirmación o mensaje de éxito si es necesario
        } catch (PDOException $e) {
            // Si ocurre un error, revertir la transacción
            $this->bd->rollBack();
            // Manejar la excepción
            $errorMessage = "Error al eliminar el juego de usuario: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
        
    }

    public function actualizarVideojuegoUsuario($data) {

        try {

            // Insertar datos en la base de datos
            $status = $data['status'];
            $personal_comment = $data['personal_comment'];
            $rating = $data['rating'];
            $user_email = $data['user_email'];
            $game_id = $data['game_id'];

            // Preparar la consulta
            $query = $this->bd->prepare(
                "UPDATE User_games 
            SET status = ?, personal_comment = ?, rating = ?
            WHERE user_email = ? && game_id = ?"
            );

            // Ejecutar consulta
            $query->execute([$status, $personal_comment, $rating, $user_email, $game_id]);

        } catch (PDOException $e) {

            // Manejar la excepción
            $errorMessage = "Error al actualizar videojuego del usuario: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }

    }

}

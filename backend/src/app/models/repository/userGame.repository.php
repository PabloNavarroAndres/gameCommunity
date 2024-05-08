<?php

require_once "bd.php";
require_once 'app/models/model/game.model.php';

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
            $userGamesData = $sql->fetchAll(PDO::FETCH_OBJ); 

            // Crear objetos Game a partir de los datos
            /* $userGames = [];
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
            } */

            return $userGamesData;

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener videojuegos del usuario: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

}

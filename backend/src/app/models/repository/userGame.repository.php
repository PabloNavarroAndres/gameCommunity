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
            
            // Insertar datos en la base de datos
            $game_id = $data['game_id'];
            $user_email = $data['user_email'];

            $query = "INSERT INTO User_games 
                    (game_id, user_email) 
                    VALUES ('$game_id', '$user_email')";

            if ($this->bd->query($query) === TRUE) {
                echo json_encode(array('message' => 'Videojuego al usuario agregado correctamente'));
            }

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar videojuego de usuario' => $e->getMessage()));
        }
    }

}

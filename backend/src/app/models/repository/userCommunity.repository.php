<?php

require_once "bd.php";
require_once 'app/models/model/userCommunity.model.php';

class UserCommunityRepository {

    private $bd;

    public function __construct() {
        $this->bd = BD::getBD();
    }


    public function obtenerUsuariosComunidad($community_id) {
        try {
            // Consulta para obtener los datos
            $sql = $this->bd->prepare(
                "SELECT u.email, u.username, u.password, u.profile_picture, u.total_games, u.isAdmin, uc.community_id, uc.isCreator
                FROM Users_in_communities uc
                JOIN Users u ON uc.user_email = u.email
                WHERE uc.community_id = ?"
            );

            $sql->execute([$community_id]);
            
            // Datos obtenidos del SQL, como un array asociativo
            $usersCommunityData = $sql->fetchAll(PDO::FETCH_ASSOC);

            // Crear objetos a partir de los datos
            $usersCommunity = [];
            foreach ($usersCommunityData as $userCommunityData) {
                $userCommunity = new UserCommunity(
                    $userCommunityData['email'],
                    $userCommunityData['community_id'],
                    $userCommunityData['isCreator'],
                    $userCommunityData['username'],
                    $userCommunityData['isAdmin'],
                    $userCommunityData['password'],
                    $userCommunityData['profile_picture'],
                    $userCommunityData['total_games']
                );
                
                $usersCommunity[] = $userCommunity;
            }

            return $usersCommunity;

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener usuarios de comunidad: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

    public function agregarUsuarioComunidad($data) {
        try {

            // Insertar datos en la base de datos
            $user_email = $data['user_email'];
            $community_id = $data['community_id'];
            $isCreator = $data['isCreator'];

            // Query para agregar el juego de usuario
            $sql = $this->bd->prepare(
                "INSERT INTO Users_in_communities 
                (user_email, community_id, isCreator) 
                VALUES (?, ?, ?)"
            );

            $sql->execute([$user_email, $community_id, $isCreator]);
         

        } catch (Exception $e) {

            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario de comunidad' => $e->getMessage()));
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

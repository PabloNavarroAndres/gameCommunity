<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "bd.php";
require_once 'app/models/model/user.model.php';

class UserRepository {

    private $bd;

    public function __construct() {
        $this->bd = BD::getBD();
    }


    public function obtenerUsuarios() {
        try {

            // Consulta para obtener todos los usuarios
            $sql = $this->bd->query("SELECT * FROM Users");

            // Datos obtenidos del SQL, como un array asociativo
            $usersData = $sql->fetchAll(PDO::FETCH_ASSOC); 

            // Crear objetos User a partir de los datos
            $users = [];
            foreach ($usersData as $userData) {
                $user = new User(
                    $userData['email'],
                    $userData['username'],
                    $userData['password'],
                    $userData['profile_picture'],
                    $userData['total_games'],
                    $userData['finished_games'],
                    $userData['desired_games'],
                    $userData['isAdmin']
                );
                $users[] = $user;
            }

            return $users;

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener usuarios: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

    // Otros métodos del repositorio para agregar y actualizar usuarios
}

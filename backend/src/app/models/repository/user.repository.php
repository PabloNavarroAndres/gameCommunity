<?php

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

    public function agregarUsuario($data) {

        // Insertar datos en la base de datos
        $email = $data['email'];
        $username = $data['username'];
        $password = $data['password'];
        $profile_picture = '../../../assets/perfil/user.png';
        $total_games = 0;
        $isAdmin = 0;

        $query = "INSERT INTO Users 
                (email, username, password, profile_picture, total_games, isAdmin) 
                VALUES ('$email', '$username', '$password', '$profile_picture', '$total_games', '$isAdmin')";

        if ($this->bd->query($query) === TRUE) {

            // Establecer código de estado 201
            http_response_code(201);

        }
    }

    // Otros métodos del repositorio para agregar y actualizar usuarios
}

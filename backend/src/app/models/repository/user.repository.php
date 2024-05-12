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
            $errorMessage = "Error al obtener usuarios sql: " . $e->getMessage();
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

    public function actualizarUsuario($data) {

        // Insertar datos en la base de datos
        $username = $data['username'];
        $profile_picture = $data['profile_picture'];
        $email = $data['email'];

        // Preparar la consulta
        $query = $this->bd->prepare("UPDATE Users SET username = ?, profile_picture = ? WHERE email = ?");

        // Ejecutar consulta
        $query->execute([$username, $profile_picture, $email]);
    }

    public function sumarDeseado($data) {

        $email = $data['email'];

        // Preparar la consulta
        $query = $this->bd->prepare("UPDATE Users SET desired_games = desired_games + 1 WHERE email = ?");

        // Ejecutar consulta
        $query->execute([$email]);
    }

    public function restarDeseado($data) {

        $email = $data['email'];

        // Preparar la consulta
        $query = $this->bd->prepare("UPDATE Users SET desired_games = desired_games - 1 WHERE email = ?");

        // Ejecutar consulta
        $query->execute([$email]);
    }
    

}

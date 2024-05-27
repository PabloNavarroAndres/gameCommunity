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

    public function obtenerUsuarioEmail($email) {
        try {

            // Consulta para obtener un usuario por su email
            $query = $this->bd->prepare("SELECT * FROM Users WHERE email = ?");

            // Ejecutar consulta
            $query->execute([$email]);

            // Obtener la primera fila de resultados como un array asociativo
            $userData = $query->fetch(PDO::FETCH_ASSOC);

            // Verificar si se encontró un usuario
            if ($userData) {
                // Crear objeto User a partir de los datos
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

                return $user;

            } else {
                // Si no se encuentra ningún usuario, lanzar una excepción
                throw new Exception("No se encontró ningún usuario con el correo electrónico proporcionado.");
            }


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

        $query = $this->bd->prepare("INSERT INTO Users 
                (email, username, password, profile_picture, total_games, isAdmin) 
                VALUES (?, ?, ?, ?, ?, ?)");

        // Ejecutar consulta
        $query->execute([$email, $username, $password, $profile_picture, $total_games, $isAdmin]);
    }

    public function eliminarUsuario($email) {

        try {
            // Iniciar una transacción
            $this->bd->beginTransaction();

            $query = $this->bd->prepare(
                "DELETE FROM Users WHERE email = ?"
            );

            // Ejecutar consulta
            $query->execute([$email]);

            // Confirmar la transacción
            $this->bd->commit();

        } catch (Exception $e) {
            // Revertir la transacción en caso de error
            $this->bd->rollBack();

            throw new Exception("Error al obtener usuarios sql: " . $e->getMessage());
        }
    }
    
    public function hacerAdministrador($email) {

        $query = $this->bd->prepare(
            "UPDATE Users 
            SET isAdmin = 1
            WHERE email = ?"
        );

        // Ejecutar consulta
        $query->execute([$email]);
    }

    public function quitarAdministrador($email) {

        $query = $this->bd->prepare(
            "UPDATE Users 
            SET isAdmin = 0
            WHERE email = ?"
        );

        // Ejecutar consulta
        $query->execute([$email]);
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
    
    public function sumarTerminado($data) {

        $email = $data['email'];

        // Preparar la consulta
        $query = $this->bd->prepare("UPDATE Users SET finished_games = finished_games + 1 WHERE email = ?");

        // Ejecutar consulta
        $query->execute([$email]);
    }

    public function restarTerminado($data) {

        $email = $data['email'];

        // Preparar la consulta
        $query = $this->bd->prepare("UPDATE Users SET finished_games = finished_games - 1 WHERE email = ?");

        // Ejecutar consulta
        $query->execute([$email]);
    }

}

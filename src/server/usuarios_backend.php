<?php

header("Access-Control-Allow-Origin: http://localhost:4200");

// Conexion de la BBDD
$bd = include_once "bd.php";

// Tipo de accion para la tabla de usuarios
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'obtenerUsuarios':
        try {
            // Consulta para obtener todos los usuarios
            $sql = $bd->query("SELECT * FROM Users");
            $usuarios = $sql->fetchAll(PDO::FETCH_OBJ);

            // Devolver los datos como JSON
            header('Content-Type: application/json');
            echo json_encode($usuarios);

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener usuarios: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
        break;

    case 'agregarUsuario':
        try {
            // Crear un nuevo usuario
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Insertar datos en la base de datos
            $email = $data['email'] ?? '';
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';
            $profile_picture = 'src/assets/perfil/user.png';
            $total_games = 0;
            $isAdmin = 0;

            $query = "INSERT INTO Users 
                    (email, username, password, profile_picture, total_games, isAdmin) 
                    VALUES ('$email', '$username', '$password', '$profile_picture', '$total_games', '$isAdmin')";

            if ($bd->query($query) === TRUE) {
                echo json_encode(array('message' => 'Usuario creado correctamente'));
            }

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario' => $e->getMessage()));
        }
        break;

    // Agregar casos para actualizarUsuario y eliminarUsuario según sea necesario...

    default:
        // Acción no válida
        echo json_encode(array('error' => 'Accion no valida'));
        break;
}

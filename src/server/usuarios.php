<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Conexion de la BBDD
$bd = include_once "bd.php";

// Tipo de accion para la tabla de usuarios
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'obtenerUsuarios':
        try {
            // Consulta para obtener todos los usuarios
            $sql = $bd->query("SELECT * FROM Users");
            $juegos = $sql->fetchAll(PDO::FETCH_OBJ);

            // Devolver los datos como JSON
            header('Content-Type: application/json');
            echo json_encode($juegos);

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

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email']) || !isset($data['username']) || !isset($data['password'])) {
                throw new Exception('Faltan campos obligatorios de usuario');
            }

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

            if ($bd->query($query) === TRUE) {
                echo json_encode(array('message' => 'Usuario creado correctamente'));
            }

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario' => $e->getMessage()));
        }
        break;

    case 'actualizarUsuario':
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email']) || !isset($data['username']) || !isset($data['profile_picture'])) {
                throw new Exception('Faltan campos obligatorios de usuario');
            }

            // Insertar datos en la base de datos
            $username = $data['username'];
            $profile_picture = $data['profile_picture'];
            $email = $data['email'];

            // Preparar la consulta
            $query = $bd->prepare("UPDATE Users SET username = ?, profile_picture = ? WHERE email = ?");

            if ($query) {
                $result = $query->execute([$username, $profile_picture, $email]);

                if ($result && $query->rowCount() > 0) {
                    echo json_encode(['message' => 'Usuario actualizado correctamente']);
                } else {
                    echo json_encode(['message' => 'No se pudo actualizar el usuario']);
                }
            } else {
                throw new Exception('Error al preparar la consulta');
            }

        } catch (Exception $e) {
            echo json_encode(['Error al actualizar usuario' => $e->getMessage()]);
        }

        break;

    default:
        // Acción no válida
        echo json_encode(array('error' => 'Accion no valida'));
        break;
}

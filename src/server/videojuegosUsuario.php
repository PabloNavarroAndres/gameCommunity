<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Conexion de la BBDD
$bd = include_once "bd.php";

// Tipo de accion para la tabla de videojuegos
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'obtenerVideojuegosUsuario':
        try {
            // Obtenemos el email que se ha pasado como parametro
            $email = $_GET['email'];

            // Consulta para obtener los datos de User_games y Games
            $sql = $bd->prepare("SELECT UG.user_email, G.title, G.image, UG.status, UG.personal_comment, UG.rating 
                               FROM User_games UG
                               JOIN Games G ON UG.game_id = G.game_id
                               WHERE UG.user_email = ?"
                            );
            $sql->execute(array($email));
            $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
        
            // Devolver los datos como JSON
            header('Content-Type: application/json');
            echo json_encode($datos);
        
        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener los datos: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }        
        break;

    case 'agregarVideojuegoUsuario':
      
        /* try {
            // Crear un nuevo videojuego de usuario
            // Obtener los datos del videojuego del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['game_id']) || !isset($data['user_email'])) {
                throw new Exception('Faltan campos obligatorios del videojuego de usuario');
            }

            // Insertar datos en la base de datos
            $game_id = $data['game_id'];
            $user_email = $data['user_email'];

            $query = "INSERT INTO User_games 
                    (game_id, user_email) 
                    VALUES ('$game_id', '$user_email')";

            if ($bd->query($query) === TRUE) {
                echo json_encode(array('message' => 'Videojuego de usuario creado correctamente'));
            }

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar videojuego de usuario' => $e->getMessage()));
        } */
        
        try {
            // Crear un nuevo usuario
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            /* $data = json_decode(file_get_contents('php://input'), true);
 */
            // Verificar si se proporcionaron todos los campos necesarios
            /* if (!isset($data['email']) || !isset($data['username']) || !isset($data['password'])) {
                throw new Exception('Faltan campos obligatorios de usuario');
            } */

            /* // Insertar datos en la base de datos
            $email = $data['email'];
            $username = $data['username'];
            $password = $data['password'];
            $profile_picture = '../../../assets/perfil/user.png';
            $total_games = 0;
            $isAdmin = 0; */

            $query = "INSERT INTO User_games 
                    (user_email, game_id) 
                    VALUES ('pablo@gmail.com', 8)";

            $bd->query($query);

        } catch (PDOException $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario' => $e->getMessage()));
        }
        break;
        


    // Agregar casos para actualizarVideojuego y eliminarVideojuego...

    default:
        // Acción no válida
        echo json_encode(array('error' => 'Accion no valida'));
        break;
}
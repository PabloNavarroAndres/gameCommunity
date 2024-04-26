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

    case 'agregarVideojuego':
        try {
            // Crear un nuevo videojuego
            // Obtener los datos del videojuego del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['valor']) || !isset($data['valor'])) {
                throw new Exception('Faltan campos obligatorios del videojuego');
            }

            // Insertar datos en la base de datos
            $valor = $data['valor'];

            $query = "INSERT INTO Games 
                    (valor, valor) 
                    VALUES ('$valor', '$valor')";

            if ($bd->query($query) === TRUE) {
                echo json_encode(array('message' => 'Videojuego creado correctamente'));
            }

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar videojuego' => $e->getMessage()));
        }
        break;

    // Agregar casos para actualizarVideojuego y eliminarVideojuego...

    default:
        // Acción no válida
        echo json_encode(array('error' => 'Accion no valida'));
        break;
}
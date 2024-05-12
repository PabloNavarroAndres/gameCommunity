<?php

require_once 'app/models/repository/game.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia de GameRepository con la conexión a la base de datos
$gameRepository = new GameRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerVideojuegos':
        try {
            $email = $_GET['email'];

            /* if(!isset($email)) {
                throw new Exception('Falta el email del usuario');
            } */

            // Datos obtenidos del metodo
            $games = $gameRepository->obtenerVideojuegos($email);

            // Devolverlo en Json
            JsonView::render($games);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    /* case 'agregarVideojuego':
        try {

            // Crear un nuevo usuario
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email']) || !isset($data['username']) || !isset($data['password'])) {
                throw new Exception('Faltan campos obligatorios de usuario');
            }
            
            // Datos obtenidos del metodo
            $userRepository->agregarUsuario($data);

            // Devolverlo en Json
            JsonView::agregadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario' => $e->getMessage()));
        }
        break; */

    // Otros casos para agregar y actualizar usuarios
    
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

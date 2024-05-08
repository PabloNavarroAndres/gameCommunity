<?php

require_once 'app/models/repository/userGame.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia de GameRepository con la conexión a la base de datos
$userGameRepository = new UserGameRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerVideojuegosUsuario':
        try {
            // Datos obtenidos del metodo
            $userGames = $userGameRepository->obtenerVideojuegosUsuario();

            // Devolverlo en Json
            JsonView::render($userGames);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'agregarVideojuegoUsuario':
        try {

            // Crear un nuevo usuario
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['game_id']) || !isset($data['user_email'])) {
                throw new Exception('Faltan campos obligatorios del videojuego de usuario');
            }

            // Datos obtenidos del metodo
            $userGameRepository->agregarVideojuegoUsuario($data);

            // Devolverlo en Json
            JsonView::agregadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario' => $e->getMessage()));
        }
        break;

    // Otros casos para agregar y actualizar usuarios
    
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

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

            // Crear un nuevo videojuego de usuario
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
            echo json_encode(array('Error al insertar videojuego de usuario' => $e->getMessage()));
        }
        break;

    case 'actualizarVideojuegoUsuario':
        try {

            // Obtener los datos de los detalles de videojuego del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron los campos necesarios
            if ( !isset($data['user_email']) || !isset($data['game_id']) ) {

                throw new Exception('Faltan campos obligatorios del videojuego de usuario');

            } else if (!isset($data['status']) && !isset($data['personal_comment']) && !isset($data['rating'])) {

                throw new Exception('No se ha enviado ninguno de los campos de detalles a actualizar');
            }

            // Datos obtenidos del metodo
            $userGameRepository->actualizarVideojuegoUsuario($data);

            // Devolverlo en Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al actualizar videojuego de usuario' => $e->getMessage()));
        }
        break;

    // Otros casos para agregar y actualizar usuarios
    
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

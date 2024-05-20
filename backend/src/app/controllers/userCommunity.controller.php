<?php

require_once 'app/models/repository/userCommunity.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia del repositorio con la conexión a la base de datos
$userCommunityRepository = new UserCommunityRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerUsuariosComunidad':
        try {

            // Comunidad id
            $community_id = $_GET['community_id'];

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($community_id)) {
                throw new Exception('Falta el id de la comunidad');
            }

            // Datos obtenidos del metodo
            $usersCommunity = $userCommunityRepository->obtenerUsuariosComunidad($community_id);

            // Devolverlo en Json
            JsonView::render($usersCommunity);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'agregarUsuariosComunidad':
        try {

            // Crear un nuevo usuario de comunidad
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['game_id']) || !isset($data['user_email'])) {
                throw new Exception('Faltan campos obligatorios del usuario de comunidad');
            }

            // Datos obtenidos del metodo
            $userCommunityRepository->agregarVideojuegoUsuario($data);

            // Devolverlo en Json
            JsonView::agregadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario de comunidad' => $e->getMessage()));
        }
        break;
        
    case 'eliminarUsuariosComunidad':
        try {

            // Crear un nuevo usuario de comunidad
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['game_id']) || !isset($data['user_email'])) {
                throw new Exception('Faltan campos obligatorios del usuario de comunidad');
            }

            // Datos obtenidos del metodo
            $userCommunityRepository->eliminarVideojuegoUsuario($data);

            // Devolverlo en Json
            JsonView::eliminadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al eliminar usuario de comunidad' => $e->getMessage()));
        }
        break;

    case 'actualizarUsuariosComunidad':
        try {

            // Obtener los datos de los detalles de videojuego del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron los campos necesarios
            if ( !isset($data['user_email']) || !isset($data['game_id']) ) {

                throw new Exception('Faltan campos obligatorios del usuario de comunidad');

            } else if (!isset($data['status']) && !isset($data['personal_comment']) && !isset($data['rating'])) {

                throw new Exception('No se ha enviado ninguno de los campos de detalles a actualizar');
            }

            // Datos obtenidos del metodo
            $userCommunityRepository->actualizarVideojuegoUsuario($data);

            // Devolverlo en Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al actualizar usuario de comunidad' => $e->getMessage()));
        }
        break;

    // Otros casos para agregar y actualizar usuarios
    
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

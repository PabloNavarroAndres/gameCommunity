<?php

require_once 'app/models/repository/community.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia de GameRepository con la conexión a la base de datos
$communityRepository = new CommunityRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerComunidades':
        try {

            // Datos obtenidos del metodo
            $game = $communityRepository->obtenerComunidades();

            // Devolverlo en Json
            JsonView::render($game);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'obtenerComunidad':
        try {

            // Obtener los datos del comunidad del cuerpo de la solicitud (POST)
            $community_id = $_GET['community_id'];

            // Verificar si se proporcionaron todos los campos necesarios
            if ( !isset($community_id)) {
                throw new Exception('Falta el id de comunidad');
            }

            // Datos obtenidos del metodo
            $game = $communityRepository->obtenerComunidad($community_id);

            // Devolverlo en Json
            JsonView::render($game);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'agregarComunidad':
        try {

            // Crear una nueva comunidad
            // Obtener los datos del comunidad del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if ( !isset($data['title']) || !isset($data['description']) ||
                !isset($data['image']) || !isset($data['creator_email'])) {
                throw new Exception('Faltan campos obligatorios de comunidad');
            }
            
            // Funcion de agregar
            $communityRepository->agregarComunidad($data);

            // Devolverlo en Json
            JsonView::agregadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar comunidad' => $e->getMessage()));
        }
        break;

    case 'eliminarComunidad':
        try {

            // Obtener los datos
            $community_id = $_GET['community_id'];

            // Verificar si se proporcionaron todos los campos necesarios
            if ( !isset($community_id)) {
                throw new Exception('Falta el id de comunidad');
            }
            
            // Funcion de eliminar
            $communityRepository->eliminarComunidad($community_id);

            // Devolverlo en Json
            JsonView::eliminadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar comunidad' => $e->getMessage()));
        }
        break;

    case 'actualizarComunidad':
        try {

            // Obtener los datos del comunidad del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if ( !isset($data['title']) || !isset($data['description']) ||
                !isset($data['image']) || !isset($data['community_id'])) {
                throw new Exception('Faltan campos obligatorios de comunidad');
            }
            
            // Funcion de eliminar
            $communityRepository->actualizarComunidad($data);

            // Devolverlo en Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al actualizar comunidad' => $e->getMessage()));
        }
        break;
    

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

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
            $community = $communityRepository->obtenerComunidades();

            // Devolverlo en Json
            JsonView::render($community);

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
            
            // Datos obtenidos del metodo
            $communityRepository->agregarComunidad($data);

            // Devolverlo en Json
            JsonView::agregadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar comunidad' => $e->getMessage()));
        }
        break;
    

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

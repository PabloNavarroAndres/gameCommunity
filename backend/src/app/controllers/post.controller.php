<?php

require_once 'app/models/repository/post.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia de PostRepository con la conexión a la base de datos
$postRepository = new PostRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerPosts':
        try {

            $community_id = $_GET['community_id'];

            // Datos obtenidos del metodo
            $posts = $postRepository->obtenerPosts($community_id);

            // Devolverlo en Json
            JsonView::render($posts);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'crearPost':
        try {

            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['content']) || !isset($data['user_email']) || !isset($data['community_id'])) {
                throw new Exception('Faltan campos obligatorios del usuario de comunidad');
            }

            // Datos obtenidos del metodo
            $postRepository->crearPost($data);

            // Devolverlo en Json
            JsonView::agregadoMsj();

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

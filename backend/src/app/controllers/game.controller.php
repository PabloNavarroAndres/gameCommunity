<?php

require_once 'app/models/repository/game.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia de GameRepository con la conexión a la base de datos
$postRepository = new GameRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerVideojuegos':
        try {

            // Datos obtenidos del metodo
            $post = $postRepository->obtenerVideojuegos();

            // Devolverlo en Json
            JsonView::render($post);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'obtenerVideojuegosUsuario':
        try {
            $post = $_GET['email'];

            if(!isset($post)) {
                throw new Exception('Falta el email del usuario');
            }

            // Datos obtenidos del metodo
            $post = $postRepository->obtenerVideojuegosUsuario($post);

            // Devolverlo en Json
            JsonView::render($post);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

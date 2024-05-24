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
            $community = $postRepository->obtenerVideojuegos();

            // Devolverlo en Json
            JsonView::render($community);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'obtenerVideojuegosUsuario':
        try {
            $community = $_GET['email'];

            if(!isset($community)) {
                throw new Exception('Falta el email del usuario');
            }

            // Datos obtenidos del metodo
            $community = $postRepository->obtenerVideojuegosUsuario($community);

            // Devolverlo en Json
            JsonView::render($community);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

<?php

require_once 'app/models/repository/game.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia de GameRepository con la conexión a la base de datos
$gameRepository = new GameRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerVideojuegos':
        try {

            // Datos obtenidos del metodo
            $games = $gameRepository->obtenerVideojuegos();

            // Devolverlo en Json
            JsonView::render($games);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'obtenerVideojuegosUsuario':
        try {
            $email = $_GET['email'];

            if(!isset($email)) {
                throw new Exception('Falta el email del usuario');
            }

            // Datos obtenidos del metodo
            $games = $gameRepository->obtenerVideojuegosUsuario($email);

            // Devolverlo en Json
            JsonView::render($games);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

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
            $game = $gameRepository->obtenerVideojuegos();

            // Devolverlo en Json
            JsonView::render($game);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'obtenerVideojuegosUsuario':
        try {
            $game = $_GET['email'];

            if(!isset($game)) {
                throw new Exception('Falta el email del usuario');
            }

            // Datos obtenidos del metodo
            $game = $gameRepository->obtenerVideojuegosUsuario($game);

            // Devolverlo en Json
            JsonView::render($game);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'crearVideojuego':
        try {

            $title = $_POST['titulo'];
            $image = $_FILES['imagen'];

            // Comprobar campos obligatorios
            if (!isset($title) || !isset($image) ) {
                throw new Exception('Faltan campos obligatorios');
            }

            // Metodo agregar videojuego
            $gameRepository->crearVideojuego($title, $image);

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

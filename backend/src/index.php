<?php

// CORS
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELTE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if (isset($_GET['controller'])) {

    $controller = $_GET['controller'];

    switch ($controller) {
        case 'usuarios':
            include_once 'app/controllers/user.controller.php';
            break;

        /* case 'videojuegos':
            include_once 'app/controllers/videojuego.controller.php';
            break; */

        default:
            echo json_encode(['error' => 'Acción no válida']);
            break;
    }

} else {
    echo json_encode(['error' => 'No se proporcionó ninguna acción']);
}

<?php

// CORS
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

if (isset($_GET['controller'])) {

    $controller = $_GET['controller'];

    switch ($controller) {
        case 'usuarios':
            include_once 'app/controllers/user.controller.php';
            break;

        case 'videojuegos':
            include_once 'app/controllers/game.controller.php';
            break;

        case 'videojuegosUsuario':
            include_once 'app/controllers/userGame.controller.php';
            break;

        case 'comunidades':
            include_once 'app/controllers/community.controller.php';
            break;

        case 'comunidadUsuario':
            include_once 'app/controllers/userCommunity.controller.php';
            break;

        case 'post':
            include_once 'app/controllers/post.controller.php';
            break;

        default:
            echo json_encode(['error' => 'Controlador no válido']);
            break;
    }

} else {
    echo json_encode(['error' => 'No se proporcionó ningun controlador']);
}

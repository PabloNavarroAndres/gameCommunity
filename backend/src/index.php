<?php


if (isset($_GET['controller'])) {
    $controller = $_GET['controller'];
    switch ($controller) {
        case 'usuarios':
            include_once 'app/controllers/user.controller.php';
            break;
        // Agregar más casos según sea necesario para otros controladores
        default:
            echo json_encode(['error' => 'Acción no válida']);
            break;
    }
} else {
    echo json_encode(['error' => 'No se proporcionó ninguna acción']);
}

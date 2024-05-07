<?php

require_once 'app/models/repository/user.repository.php';
require_once 'app/views/json.view.php';

// Crear instancia de UserRepository con la conexión a la base de datos
$userRepository = new UserRepository;

$action = $_GET['action'];

switch ($action) {

    case 'obtenerUsuarios':
        try {
            // Datos obtenidos del metodo
            $users = $userRepository->obtenerUsuarios();

            // Devolverlo en Json
            JsonView::render($users);

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // Otros casos para agregar y actualizar usuarios
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

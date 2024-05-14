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

    case 'agregarUsuario':
        try {

            // Crear un nuevo usuario
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email']) || !isset($data['username']) || !isset($data['password'])) {
                throw new Exception('Faltan campos obligatorios de usuario');
            }
            
            // Datos obtenidos del metodo
            $userRepository->agregarUsuario($data);

            // Devolverlo en Json
            JsonView::agregadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al insertar usuario' => $e->getMessage()));
        }
        break;

    case 'actualizarUsuario':
        try {

            // Actualizar un usuario
            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email']) || !isset($data['username']) || !isset($data['profile_picture'])) {
                throw new Exception('Faltan campos obligatorios de usuario');
            }
            
            // Datos obtenidos del metodo
            $userRepository->actualizarUsuario($data);

            // Devolverlo en Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error al actualizar usuario' => $e->getMessage()));
        }
        break;

    case 'sumarDeseado':
        try {

            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email'])) {
                throw new Exception('Falta el email obligatorio de usuario');
            }
            
            // Datos obtenidos del metodo
            $userRepository->sumarDeseado($data);

            // Respuesta Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error en controlador de sumar deseado' => $e->getMessage()));
        }
        break;

    case 'restarDeseado':
        try {

            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email'])) {
                throw new Exception('Falta el email obligatorio de usuario');
            }
            
            // Datos obtenidos del metodo
            $userRepository->restarDeseado($data);

            // Respuesta Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error en controlador de restar deseado' => $e->getMessage()));
        }
        break;

    case 'sumarTerminado':
        try {

            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email'])) {
                throw new Exception('Falta el email obligatorio de usuario');
            }
            
            // Datos obtenidos del metodo
            $userRepository->sumarTerminado($data);

            // Respuesta Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error en controlador de sumar terminado' => $e->getMessage()));
        }
        break;

    case 'restarTerminado':
        try {

            // Obtener los datos del usuario del cuerpo de la solicitud (POST)
            $data = json_decode(file_get_contents('php://input'), true);

            // Verificar si se proporcionaron todos los campos necesarios
            if (!isset($data['email'])) {
                throw new Exception('Falta el email obligatorio de usuario');
            }
            
            // Datos obtenidos del metodo
            $userRepository->restarTerminado($data);

            // Respuesta Json
            JsonView::actualizadoMsj();

        } catch (Exception $e) {
            // Manejar la excepción
            echo json_encode(array('Error en controlador de restar terminado' => $e->getMessage()));
        }
        break;


    // Otros casos para agregar y actualizar usuarios
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

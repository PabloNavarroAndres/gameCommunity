<?php

class JsonView {
    public static function render($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    public static function agregadoMsj() {
        header('Content-Type: application/json');
        echo json_encode(array('message' => 'Agregado correctamente'));
    }

    public static function eliminadoMsj() {
        header('Content-Type: application/json');
        echo json_encode(array('message' => 'Eliminado correctamente'));
    }

    public static function actualizadoMsj() {
        header('Content-Type: application/json');
        echo json_encode(array('message' => 'Actualizado correctamente'));
    }

}

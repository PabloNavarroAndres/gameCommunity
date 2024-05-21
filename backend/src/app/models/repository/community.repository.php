<?php

require_once "bd.php";
require_once 'app/models/model/community.model.php';

class CommunityRepository {

    private $bd;

    public function __construct() {
        $this->bd = BD::getBD();
    }


    public function obtenerComunidades() {
        try {

            // Consulta para obtener todas las comunidades
            $sql = $this->bd->query(
                "SELECT * FROM Communities"
            );

            // Datos obtenidos del SQL, como un array asociativo
            $communitiesData = $sql->fetchAll(PDO::FETCH_ASSOC); 

            // Crear objetos Game a partir de los datos
            $communities = [];
            foreach ($communitiesData as $communityData) {
                $community = new Community(
                    $communityData['community_id'],
                    $communityData['title'],
                    $communityData['description'],
                    $communityData['image'],
                    $communityData['creator_email']
                );
                $communities[] = $community;
            }

            return $communities;

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener comunidades: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

    public function agregarComunidad($data) {

        // Insertar datos en la base de datos
        $title = $data['title'];
        $description = $data['description'];
        $image = $data['image'];
        $creator_email = $data['creator_email'];

        $queryCommunity = $this->bd->prepare("INSERT INTO Communities 
                (title, description, image, creator_email) 
                VALUES (?, ?, ?, ?)");

        // Ejecutar consulta
        $queryCommunity->execute([$title, $description, $image, $creator_email]);

        // Obtener el ID de la última fila insertada
        $community_id = $this->bd->lastInsertId();

        // Colocar al usuario de la comunidad como creador
        $queryUsuario = $this->bd->prepare("INSERT INTO Users_in_communities 
                (user_email, community_id, isCreator) 
                VALUES (?, ?, 1)");

        // Ejecutar consulta
        $queryUsuario->execute([$creator_email, $community_id]);

    }

}

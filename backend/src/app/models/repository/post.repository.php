<?php

require_once "bd.php";
require_once 'app/models/model/post.model.php';

class PostRepository {

    private $bd;

    public function __construct() {
        $this->bd = BD::getBD();
    }


    public function obtenerPosts($community_id) {
        try {

            // Consulta para obtener todos los posts de una comunidad,
            // con la informacion asociada al usuario del post
            $sql = $this->bd->prepare(
                "SELECT 
                    p.post_id, 
                    p.content,  
                    p.user_email, 
                    p.community_id,  
                    u.username, 
                    u.profile_picture
                FROM Posts p
                JOIN Users u ON p.user_email = u.email
                WHERE  p.community_id = ?
                ORDER BY p.post_id ASC"
            );

            $sql->execute([$community_id]);

            // Datos obtenidos del SQL, como un array asociativo
            $postsData = $sql->fetchAll(PDO::FETCH_ASSOC); 

            // Crear objetos Post a partir de los datos
            $posts = [];
            foreach ($postsData as $postData) {
                $post = new Post(
                    $postData['post_id'],
                    $postData['content'],
                    $postData['user_email'],
                    $postData['community_id'],
                    $postData['profile_picture'],
                    $postData['username'],
                );
                $posts[] = $post;
            }

            return $posts;

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener usuarios sql: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

    public function crearPost($data) {
        try {

            $content = $data['content'];
            $user_email = $data['user_email'];
            $community_id = $data['community_id'];

            // Consulta para obtener todos los posts de una comunidad,
            // con la informacion asociada al usuario del post
            $sql = $this->bd->prepare(
                "INSERT INTO Posts (content, user_email, community_id) 
                VALUES (?, ?, ?)"
            );

            $sql->execute([$content, $user_email, $community_id]);

        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al insertar post: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

}

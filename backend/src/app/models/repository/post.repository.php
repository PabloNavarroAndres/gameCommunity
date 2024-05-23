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
                    p.votes, 
                    p.user_email, 
                    p.community_id, 
                    p.liked_by, 
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
                    $postData['votes'],
                    $postData['user_email'],
                    $postData['community_id'],
                    $postData['liked_by'],
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

    /* public function obtenerUsuarioEmail($email) {
        try {

            // Consulta para obtener un usuario por su email
            $query = $this->bd->prepare("SELECT * FROM Users WHERE email = ?");

            // Ejecutar consulta
            $query->execute([$email]);

            // Obtener la primera fila de resultados como un array asociativo
            $userData = $query->fetch(PDO::FETCH_ASSOC);

            // Verificar si se encontró un usuario
            if ($userData) {
                // Crear objeto User a partir de los datos
                $user = new User(
                    $userData['email'],
                    $userData['username'],
                    $userData['password'],
                    $userData['profile_picture'],
                    $userData['total_games'],
                    $userData['finished_games'],
                    $userData['desired_games'],
                    $userData['isAdmin']
                );

                return $user;

            } else {
                // Si no se encuentra ningún usuario, lanzar una excepción
                throw new Exception("No se encontró ningún usuario con el correo electrónico proporcionado.");
            }


        } catch (PDOException $e) {
            // Manejar la excepción
            $errorMessage = "Error al obtener usuarios sql: " . $e->getMessage();
            echo json_encode(array("error" => $errorMessage));
        }
    }

    public function agregarUsuario($data) {

        // Insertar datos en la base de datos
        $email = $data['email'];
        $username = $data['username'];
        $password = $data['password'];

        $query = $this->bd->prepare("INSERT INTO Users 
                (email, username, password, profile_picture, total_games, isAdmin) 
                VALUES (?, ?, ?, ?, ?, ?)");

        // Ejecutar consulta
        $query->execute([$email, $username, $password, $profile_picture, $total_games, $isAdmin]);
    } */
}

/* Idea para la BD
  ---
  Para agregar un "Me gusta" a una publicación:

  UPDATE Posts
  SET liked_by = JSON_ARRAY_APPEND(liked_by, '$', 'correo@example.com')
  WHERE post_id = id_parametro;

  ---
  Para quitar un "Me gusta":

  UPDATE Posts
  SET liked_by = JSON_REMOVE(liked_by, JSON_UNQUOTE(JSON_SEARCH(liked_by, 'one', 'correo@example.com')))
  WHERE post_id = id_parametro; */

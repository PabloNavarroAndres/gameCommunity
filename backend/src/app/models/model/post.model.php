<?php

class Post {
    // Propiedades
    public $post_id;
    public $content;
    public $user_email;
    public $community_id;
    public $profile_picture;
    public $username;

    // Constructor
    public function __construct($post_id, $content, $user_email, $community_id, $profile_picture, $username) {
        $this->post_id = $post_id;
        $this->content = $content;
        $this->user_email = $user_email;
        $this->community_id = $community_id;
        $this->profile_picture = $profile_picture;
        $this->username = $username;
    }
}

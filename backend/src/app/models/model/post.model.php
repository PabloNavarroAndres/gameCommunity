<?php

class Post {
    // Propiedades
    public $post_id;
    public $content;
    public $votes;
    public $user_email;
    public $community_id;
    public $liked_by;
    public $profile_picture;
    public $username;

    // Constructor
    public function __construct($post_id, $content, $votes, $user_email, $community_id, $liked_by, $profile_picture, $username) {
        $this->post_id = $post_id;
        $this->content = $content;
        $this->votes = $votes;
        $this->user_email = $user_email;
        $this->community_id = $community_id;
        $this->liked_by = $liked_by;
        $this->profile_picture = $profile_picture;
        $this->username = $username;
    }
}

<?php

class User {
    // Propiedades
    public $email;
    public $username;
    public $password;
    public $profile_picture;
    public $total_games;
    public $finished_games;
    public $desired_games;
    public $isAdmin;

    // Constructor
    public function __construct($email, $username, $password, $profile_picture, $total_games, $finished_games, $desired_games, $isAdmin) {
        $this->email = $email;
        $this->username = $username;
        $this->password = $password;
        $this->profile_picture = $profile_picture;
        $this->total_games = $total_games;
        $this->finished_games = $finished_games;
        $this->desired_games = $desired_games;
        $this->isAdmin = $isAdmin;
    }
}

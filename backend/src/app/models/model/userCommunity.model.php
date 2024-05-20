<?php

class UserCommunity {
    // Propiedades
    public $user_email;
    public $community_id;
    public $isCreator;
    // Propiedades extra usuario
    public $username;
    public $isAdmin;
    public $password;
    public $profile_picture;
    public $total_games;

    // Constructor
    public function __construct (
        $user_email, $community_id, $isCreator, $username,
        $isAdmin, $password, $profile_picture, $total_games) {

        $this->user_email = $user_email;
        $this->community_id = $community_id;
        $this->isCreator = $isCreator;
        
        $this->username = $username;
        $this->isAdmin = $isAdmin;
        $this->password = $password;
        $this->profile_picture = $profile_picture;
        $this->total_games = $total_games;
    }
}

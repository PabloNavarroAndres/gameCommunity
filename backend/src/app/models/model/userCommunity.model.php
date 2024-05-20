<?php

class UserCommunity {
    // Propiedades
    public $user_email;
    public $community_id;
    public $isAdmin;
    // Propiedades extra usuario
    public $username;
    public $password;
    public $profile_picture;
    public $total_games;


    // Constructor
    public function __construct (
        $user_email, $community_id, $isAdmin, 
        $username, $password, $profile_picture, $total_games) {

        $this->user_email = $user_email;
        $this->community_id = $community_id;
        $this->isAdmin = $isAdmin;
        
        $this->username = $username;
        $this->password = $password;
        $this->profile_picture = $profile_picture;
        $this->total_games = $total_games;
    }
}

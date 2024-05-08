<?php

class UserGame {
    // Propiedades
    public $game_id;
    public $user_email;
    public $title;
    public $image;
    public $status;
    public $personal_comment;
    public $rating;

    // Constructor
    public function __construct($game_id, $user_email, $title, $image, $status, $personal_comment, $rating) {
        $this->game_id = $game_id;
        $this->user_email = $user_email;
        $this->title = $title;
        $this->image = $image;
        $this->status = $status;
        $this->personal_comment = $personal_comment;
        $this->rating = $rating;
    }
}

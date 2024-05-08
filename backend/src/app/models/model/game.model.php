<?php

class Game {
    // Propiedades
    public $game_id;
    public $title;
    public $image;

    // Constructor
    public function __construct($game_id, $title, $image) {
        $this->game_id = $game_id;
        $this->title = $title;
        $this->image = $image;
    }
}

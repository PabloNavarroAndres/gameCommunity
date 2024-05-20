<?php

class Community {
    // Propiedades
    public $community_id;
    public $title;
    public $description;
    public $image;
    public $creator_email;


    // Constructor
    public function __construct($community_id, $title, $description, $image, $creator_email) {
        $this->community_id = $community_id;
        $this->title = $title;
        $this->description = $description;
        $this->image = $image;
        $this->creator_email = $creator_email;
    }
}

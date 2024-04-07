import { Component, inject } from '@angular/core';
import { Videojuego } from '../../models/videojuego.interface';
import { VideojuegosService } from '../../services/videojuegos.service';

@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [],
  templateUrl: './videojuegos.component.html',
  styleUrl: './videojuegos.component.css'
})
export class VideojuegosComponent {
  // Servicio de videojuegos
  private videojuegoService = inject(VideojuegosService);

  // Array de videojuegos
  videojuegos: Videojuego[] = [];

  ngOnInit(): void {
    // Obtener los videojuegos de la BD
    this.videojuegoService.obtenerVideojuegos().subscribe((data: Videojuego[]) => {
      console.log(data);
      this.videojuegos = data;
    })
  }
}

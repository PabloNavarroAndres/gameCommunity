import { Component, inject } from '@angular/core';
import { Videojuego } from '../../models/videojuego.interface';
import { VideojuegosService } from '../../services/videojuegos.service';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent {

  // private videojuegoService = inject(VideojuegosService);

  // videojuegos: Videojuego[] = [];

  ngOnInit(): void {
    
  }
}

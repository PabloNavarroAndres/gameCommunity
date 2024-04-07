import { Component, inject } from '@angular/core';
import { VideojuegosUsuarioService } from '../../services/videojuegos-usuario.service';
import { VideojuegoUsuario } from '../../models/videojuegoUsuario.interface';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent {

  // Servicio de videojuegos
  private videojuegoService = inject(VideojuegosUsuarioService);

  // Array de Videojuegos
  videojuegos: VideojuegoUsuario[] = [];

  // Activar o desactivar los detalles del videojuego
  detallesVideojuego: boolean = false;

  ngOnInit(): void {
    // Obtener los videojuegos del usuario de la BD
    this.videojuegoService.obtenerVideojuegosUsuario().subscribe((data: VideojuegoUsuario[]) => {
      console.log(data);
      this.videojuegos = data;
    })
  }

  // Devolver el valor verdadero/falso para mostrar detalles del juego
  mostrarDetalles(): boolean {
    return this.detallesVideojuego;
  }

  // Activar/Desactivar los detalles
  toggleDetalles() {
    this.detallesVideojuego = !this.detallesVideojuego;
  }
  
}

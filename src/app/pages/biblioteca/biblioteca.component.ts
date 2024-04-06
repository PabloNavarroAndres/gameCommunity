import { Component, inject } from '@angular/core';
import { Videojuego } from '../../models/videojuego.interface';
import { VideojuegosUsuarioService } from '../../services/videojuegos-usuario.service';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent {

  private videojuegoService = inject(VideojuegosUsuarioService);

  videojuegos: Videojuego[] = [];

  ngOnInit(): void {
    this.videojuegoService.obtenerVideojuegosUsuario().subscribe((data: Videojuego[]) => {
      console.log(data);
      this.videojuegos = data;
    })
  }

}

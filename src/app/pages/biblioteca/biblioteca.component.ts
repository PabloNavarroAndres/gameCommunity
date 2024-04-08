import { Component, inject } from '@angular/core';
import { VideojuegosUsuarioService } from '../../services/videojuegos-usuario.service';
import { VideojuegoUsuario } from '../../models/videojuegoUsuario.interface';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';

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
  private usuarioService = inject(UsuarioService);

  // Array de Videojuegos
  videojuegos: VideojuegoUsuario[] = [];

  // Activar o desactivar los detalles del videojuego
  detallesVideojuego: boolean = false;

  // usuario que ha iniciado la sesión
  usuarioIniciado = this.usuarioService.obtenerUsuarioIniciado() as User;

  ngOnInit(): void {
    // Obtener los videojuegos del usuario de la BD, usando su id
    this.videojuegoService.obtenerVideojuegosUsuario(this.usuarioIniciado.email).subscribe((data: VideojuegoUsuario[]) => {
      console.log(data);
      this.videojuegos = data;
    })
  }

  // Activar/Desactivar los detalles
  toggleDetalles(indice: number) {
    this.videojuegos[indice].mostrarDetalles = !this.videojuegos[indice].mostrarDetalles;
  }
  
}

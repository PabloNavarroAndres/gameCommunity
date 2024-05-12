import { Component, inject } from '@angular/core';
import { Videojuego } from '../../models/videojuego.interface';
import { VideojuegosService } from '../../services/videojuegos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';
import { VideojuegosUsuarioService } from '../../services/videojuegos-usuario.service';
import { VideojuegoUsuario } from '../../models/videojuegoUsuario.interface';

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
  // Servicio de videojuegos usuario
  private videojuegoUsuarioService = inject(VideojuegosUsuarioService);
  // Servicio de Usuarios
  private usuarioService = inject(UsuarioService);

  // usuario que ha iniciado la sesión
  usuarioIniciado = this.usuarioService.obtenerUsuarioIniciado() as User;

  // Snackbar para indicar el juego agregado
  private _snackBar = inject(MatSnackBar)

  // Array de videojuegos
  videojuegos: Videojuego[] = [];

  ngOnInit(): void {
    // Obtener los videojuegos de la BD
    this.videojuegoService.obtenerVideojuegos(this.usuarioIniciado.email).subscribe((data: Videojuego[]) => {
      console.log(data);
      this.videojuegos = data;
    })
  }

  // Aparecer la notificación snackbar
  openSnackBar(message: string, action: string, duration: number) {
    message = '¡' + message + ' agregado!';
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }

  // Agregar videojuego al usuario
  agregarVideojuego(videojuego: Videojuego) {

    // Crear un objeto que cumpla con la interfaz VideojuegoUsuario
    const videojuegoUsuario: VideojuegoUsuario = {
      game_id: videojuego.game_id,
      user_email: this.usuarioIniciado.email
    };

    // Agregarlo desde el servicio de usuarios
    this.videojuegoUsuarioService.agregarVideojuegoUsuario(videojuegoUsuario)
    .subscribe({
      next: (response: any) => {
        console.log('Insertando videojuego al servidor:', response);

      },
      error: (error: any) => {
        console.error('Error intentando agregar el videojuego:', error);
      }
    });

    // Mensaje snack bar
    this.openSnackBar(videojuego.title, 'Cerrar', 3500);
  }
}

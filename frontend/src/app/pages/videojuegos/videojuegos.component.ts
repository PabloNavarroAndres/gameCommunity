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
  private _videojuegoService = inject(VideojuegosService);
  // Servicio de videojuegos usuario
  private _videojuegoUsuarioService = inject(VideojuegosUsuarioService);
  // Servicio de Usuarios
  private _usuarioService = inject(UsuarioService);

  // Ruta base de las imagenes de videojuego
  rutaBaseImg = '../../../assets/juegos/';

  // usuario que ha iniciado la sesión
  usuarioIniciado = this._usuarioService.obtenerUsuarioIniciado() as User;

  // Snackbar para indicar el juego agregado
  private _snackBar = inject(MatSnackBar)

  // Array de videojuegos
  videojuegos: Videojuego[] = [];

  ngOnInit(): void {
    if (this.usuarioIniciado) {
      // Obtener los videojuegos de la BD, del usuario iniciado
      this._videojuegoService.obtenerVideojuegosUsuario(this.usuarioIniciado.email).subscribe((data: Videojuego[]) => {
        console.log(data);
        this.videojuegos = data;
      })

    } else {

      // Obtener todos los videojuegos de la BD
      this._videojuegoService.obtenerVideojuegos().subscribe((data: Videojuego[]) => {
        console.log(data);
        this.videojuegos = data;
      })

    }

  }

  // Notificación Snackbar de juego agregado
  notificacionAgregado(message: string, action: string, duration: number) {
    message = '¡' + message + ' agregado!';
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }

  // Notificación Snackbar de juego agregado
  notificacionError(message: string, action: string, duration: number) {
    message = '¡' + message + ' ya lo has agregado!';
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
    this._videojuegoUsuarioService.agregarVideojuegoUsuario(videojuegoUsuario)
    .subscribe({

      next: (response: any) => {
        console.log('Insertando videojuego al servidor:', response);
        
        this.usuarioIniciado.total_games!++;
        localStorage.setItem('usuarioIniciado', JSON.stringify(this.usuarioIniciado));
        
        // Mensaje snack bar
        this.notificacionAgregado(videojuego.title, 'Cerrar', 3500);

      },

      error: (error: any) => {
        console.error('Error intentando agregar el videojuego:', error);
        // Mensaje snack bar
        this.notificacionError(videojuego.title, 'Cerrar', 3500);
      }
    });

  }

  // Eliminar juego del catálogo de videojuegos
  eliminarVideojuego(game_id: number, indiceArray: number) {

    this._videojuegoService.eliminarVideojuego(game_id)
    .subscribe({

      next: (response: any) => {

        console.log('Eliminando videojuego del servidor:', response);

        // Eliminar el videojuego del array
        this.videojuegos.splice(indiceArray, 1);

        // Obtener el usuario iniciado con los nuevos datos actualizados
        this._usuarioService.obtenerUsuarioPorEmail(this.usuarioIniciado.email)
        .subscribe({
          next: (user: User) => {

            // Actualizar en el local storage con los nuevos datos
            this._usuarioService.agregarUsuarioIniciado(user);
          },
    
          error: (error: any) => {
            console.error('Error intentando actualizar usuario iniciado:', error);
          }
        })

      },

      error: (error: any) => {
        console.error('Error intentando eliminar el videojuego:', error);
      }
    });

  }
}

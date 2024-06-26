import { Component, inject } from '@angular/core';
import { VideojuegosUsuarioService } from '../../services/videojuegos-usuario.service';
import { VideojuegoUsuario } from '../../models/videojuegoUsuario.interface';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent {

  // Servicio de videojuegos
  private _videojuegoService = inject(VideojuegosUsuarioService);
  // Servicio de Usuarios
  private _usuarioService = inject(UsuarioService);

  // usuario que ha iniciado la sesión
  usuarioIniciado = this._usuarioService.obtenerUsuarioIniciado() as User;

  // Array de Videojuegos
  videojuegos?: VideojuegoUsuario[];

  // Indice de videojuego a mostrar en detalles
  indiceVideojuego = 0;

  // Activar o desactivar los detalles del videojuego
  detallesVideojuego: boolean = false;

  // Ruta base de las imagenes de videojuego
  rutaBaseImg = 'http://localhost/gameCommunity/backend/imgs/games/';

  // Valores para editar detalles de videojuego
  estado?: string;
  comentario?: string;
  calificacion?: number;

  ngOnInit(): void {
    // Obtener los videojuegos del usuario de la BD, usando su id
    this._videojuegoService.obtenerVideojuegosUsuario(this.usuarioIniciado.email).subscribe((data: VideojuegoUsuario[]) => {
      this.videojuegos = data;
    })
  }

  // Activar modal detalles videojuego
  mostrarDetalles(indice: number) {
    this.indiceVideojuego = indice;
  }

  // Eliminar juego de la biblioteca
  eliminarVideojuego(gameId: number, indiceArray: number) {

    // Crear un objeto que cumpla con la interfaz VideojuegoUsuario
    const videojuegoUsuario: VideojuegoUsuario = {
      game_id: gameId,
      user_email: this.usuarioIniciado.email
    };

    this._videojuegoService.eliminarVideojuegoUsuario(videojuegoUsuario)
    .subscribe({

      next: (response: any) => {

        console.log('Eliminando videojuego del servidor:', response);

        /* Estado del juego a comprobar */
        const status = this.videojuegos ? this.videojuegos[indiceArray]?.status : null;

        // Comprobamos en que estado estaba el juego para restarlo
        // de su contador correspondiente
        switch (status) {
          case 'Terminado':
            
            // Funcion restar terminados -1
            this._usuarioService.restarJuegoTerminado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Terminado restado correctamente');
                this.usuarioIniciado.finished_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al restar terminado deseado al usuario:', error);
              }
            });

            break;

          case 'Lista de deseos':

            // Funcion restar deseados -1
            this._usuarioService.restarJuegoDeseado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Deseado restado correctamente');
                this.usuarioIniciado.desired_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al restar deseado al usuario:', error);
              }
            });

            break;
        
          default:
            break;
        }

        // Eliminar el videojuego del array
        this.videojuegos?.splice(indiceArray, 1);

        // Restar uno a juegos totales del usuario
        this.usuarioIniciado.total_games!--;
        this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
      },

      error: (error: any) => {
        console.error('Error intentando agregar el videojuego:', error);
      }
    });
  }


  // Editar los detalles del videojuego
  editarDetalles() {

    // Videojuego seleccionado
    const videojuego = this.videojuegos ? this.videojuegos[this.indiceVideojuego] : null;

    // Videojuego del usuario con los datos actualizados
    // (mientras los campos no sean indefinidos)
    if (this.estado !== undefined) {

      // Segun el estado al que vayamos a cambiarlo
      // cambiará la estadística de usuario
      switch (this.estado) {
        case 'Terminado':

          // Si ya estaba terminado se queda igual
          if (this.estado === videojuego!.status) {
            break;
          }

          // Si estaba en lista de deseados se resta del contador
          // de juegos deseados
          if (videojuego!.status === 'Lista de deseos') {
            // Funcion restar deseados -1
            this._usuarioService.restarJuegoDeseado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Deseado restado correctamente');
                this.usuarioIniciado.desired_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al restar deseado al usuario:', error);
              }
            });
          }

          // Funcion sumar a juegos terminados +1
          this._usuarioService.sumarJuegoTerminado(this.usuarioIniciado)
          .subscribe({

            // Sumado correctamente
            next: () => {
              console.log('Terminado sumado correctamente');
              this.usuarioIniciado.finished_games!++;
              this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);

            },
      
            error: (error: any) => {
              console.error('Error al sumar terminado deseado al usuario:', error);
            }
          });

          // Actualizamos estado del videojuego
          videojuego!.status = this.estado;

          break;

        case 'Lista de deseos':

          // Si ya estaba en deseados se queda igual
          if (this.estado === videojuego!.status) {
            break;
          }

          // Si estaba en lista de terminados se resta del contador
          // de juegos terminados
          if (videojuego!.status === 'Terminado') {
            // Funcion restar terminados -1
            this._usuarioService.restarJuegoTerminado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Terminado restado correctamente');
                this.usuarioIniciado.finished_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al restar terminado deseado al usuario:', error);
              }
            });
          }

          // Funcion sumar a juegos deseados +1
          this._usuarioService.sumarJuegoDeseado(this.usuarioIniciado)
          .subscribe({

            // Sumado correctamente
            next: () => {
              console.log('Deseado sumado correctamente');
              this.usuarioIniciado.desired_games!++;
              this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);

            },
      
            error: (error: any) => {
              console.error('Error al sumar deseado al usuario:', error);
            }
          });

          // Actualizamos estado del videojuego
          videojuego!.status = this.estado;

          break;

        case 'Por empezar':

          // Si ya estaba en deseados se queda igual
          if (this.estado === videojuego!.status) {
            break;
          }

          // Si estaba en lista de terminados se resta del contador
          // de juegos terminados
          if (videojuego!.status === 'Terminado') {
            // Funcion restar terminados -1
            this._usuarioService.restarJuegoTerminado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Terminado restado correctamente');
                this.usuarioIniciado.finished_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al restar terminado deseado al usuario:', error);
              }
            });
          }

          // Si estaba en lista de deseados se resta del contador
          // de juegos deseados
          if (videojuego!.status === 'Lista de deseos') {
            // Funcion restar deseados -1
            this._usuarioService.restarJuegoDeseado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Deseado restado correctamente');
                this.usuarioIniciado.desired_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al sumar deseado al usuario:', error);
              }
            });
          }

          // Actualizamos estado del videojuego
          videojuego!.status = this.estado;
          
          break;
        
        case 'En progreso':

          // Si ya estaba en deseados se queda igual
          if (this.estado === videojuego!.status) {
            break;
          }

          // Si estaba en lista de terminados se resta del contador
          // de juegos terminados
          if (videojuego!.status === 'Terminado') {
            // Funcion restar terminados -1
            this._usuarioService.restarJuegoTerminado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Terminado restado correctamente');
                this.usuarioIniciado.finished_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al restar terminado deseado al usuario:', error);
              }
            });
          }

          // Si estaba en lista de deseados se resta del contador
          // de juegos deseados
          if (videojuego!.status === 'Lista de deseos') {
            // Funcion restar deseados -1
            this._usuarioService.restarJuegoDeseado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Deseado restado correctamente');
                this.usuarioIniciado.desired_games!--;
                this._usuarioService.agregarUsuarioIniciado(this.usuarioIniciado);
  
              },
        
              error: (error: any) => {
                console.error('Error al sumar deseado al usuario:', error);
              }
            });
          }

          // Actualizamos estado del videojuego
          videojuego!.status = this.estado;

          break;

        default:
          break;
      }

      videojuego!.status = this.estado;
    }

    // Si el campo no está vacío se actualiza
    if (this.comentario !== undefined) {
      videojuego!.personal_comment = this.comentario;
    }

    // Si el campo no está vacío se actualiza
    if (this.calificacion !== undefined) {
      videojuego!.rating = this.calificacion;
    }

    // Actualizar en la BD
    this._videojuegoService.actualizarVideojuegoUsuario(videojuego as VideojuegoUsuario)
    .subscribe({

      // Videojuego de usuario obtenido
      next: (response: VideojuegoUsuario) => {
        console.log('Videojuego de usuario actualizado correctamente', response);
      },

      error: (error: any) => {
        console.error('Error al actualizar videojuego del usuario:', error);
      }
    });

    // Vaciar campos de edición
    this.resetForm();
  }

  // Vaciar los campos del modo editar detalles
  resetForm() {
    // Vaciar los campos del modal de editar detalles si es necesario
    this.estado = undefined;
    this.comentario = undefined;
    this.calificacion = undefined;
  }
  
}

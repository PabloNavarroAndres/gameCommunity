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
  private videojuegoService = inject(VideojuegosUsuarioService);
  // Servicio de Usuarios
  private usuarioService = inject(UsuarioService);

  // usuario que ha iniciado la sesión
  usuarioIniciado = this.usuarioService.obtenerUsuarioIniciado() as User;

  // Array de Videojuegos
  videojuegos: VideojuegoUsuario[] = [];

  // Indice de videojuego a mostrar en detalles
  indiceVideojuego = 0;

  // Activar o desactivar los detalles del videojuego
  detallesVideojuego: boolean = false;

  // Valores para editar detalles de videojuego
  estado?: string;
  comentario?: string;
  calificacion?: number;

  ngOnInit(): void {
    // Obtener los videojuegos del usuario de la BD, usando su id
    this.videojuegoService.obtenerVideojuegosUsuario(this.usuarioIniciado.email).subscribe((data: VideojuegoUsuario[]) => {
      this.videojuegos = data;
    })
  }

  // Activar modal detalles videojuego
  mostrarDetalles(indice: number) {
    this.indiceVideojuego = indice;
  }

  // Editar los detalles del videojuego
  editarDetalles() {

    // Videojuego seleccionado
    const videojuego = this.videojuegos[this.indiceVideojuego];

    // Videojuego del usuario con los datos actualizados
    // (mientras los campos no sean indefinidos)
    if (this.estado !== undefined) {

      // Segun el estado al que vayamos a cambiarlo
      // cambiará la estadística de usuario
      switch (this.estado) {
        case 'Terminado':

          // Si ya estaba terminado se queda igual
          if (this.estado === videojuego.status) {
            break;
          }

          // Si estaba en lista de deseados se resta del contador
          // de juegos deseados
          if (videojuego.status === 'Lista de deseos') {
            // Funcion restar deseados -1
            // ...
          }

          // Funcion sumar a juegos terminados +1
          // ...

          // Actualizamos estado del videojuego
          videojuego.status = this.estado;

          break;

        case 'Lista de deseos':

          // Si ya estaba en deseados se queda igual
          if (this.estado === videojuego.status) {
            break;
          }

          // Si estaba en lista de terminados se resta del contador
          // de juegos terminados
          if (videojuego.status === 'Terminados') {
            // Funcion restar terminados -1
            // ...
          }

          // Funcion sumar a juegos deseados +1
          this.usuarioService.sumarJuegoDeseado(this.usuarioIniciado)
          .subscribe({

            // Sumado correctamente
            next: () => {
              console.log('Deseado sumado correctamente');
              this.usuarioIniciado.desired_games!++;
              localStorage.setItem('usuarioIniciado', JSON.stringify(this.usuarioIniciado));

            },
      
            error: (error: any) => {
              console.error('Error al sumar deseado al usuario:', error);
            }
          });

          // Actualizamos estado del videojuego
          videojuego.status = this.estado;

          break;

        case 'Por empezar':

          // Si estaba en lista de terminados se resta del contador
          // de juegos terminados
          if (videojuego.status === 'Terminados') {
            // Funcion restar terminados -1
            // ...
          }

          // Si estaba en lista de deseados se resta del contador
          // de juegos deseados
          if (videojuego.status === 'Lista de deseos') {
            // Funcion restar deseados -1
            this.usuarioService.restarJuegoDeseado(this.usuarioIniciado)
            .subscribe({

              // Restado correctamente
              next: () => {
                console.log('Deseado restado correctamente');
                this.usuarioIniciado.desired_games!--;
                localStorage.setItem('usuarioIniciado', JSON.stringify(this.usuarioIniciado));
  
              },
        
              error: (error: any) => {
                console.error('Error al sumar deseado al usuario:', error);
              }
            });
          }
          
          break;
        
        case 'En progreso':

          
          break;

        default:
          videojuego.status = this.estado;
          break;
      }

      videojuego.status = this.estado;
    }

    if (this.comentario !== undefined) {
      videojuego.personal_comment = this.comentario;
    }

    if (this.calificacion !== undefined) {
      videojuego.rating = this.calificacion;
    }

    // Actualizar en la BD
    this.videojuegoService.actualizarVideojuegoUsuario(videojuego)
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

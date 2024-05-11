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

    // Videojuego del usuario con los datos actualizados
    // (mientras los campos no sean indefinidos)
    if (this.estado !== undefined) {
      this.videojuegos[this.indiceVideojuego].status = this.estado;
    }

    if (this.comentario !== undefined) {
      this.videojuegos[this.indiceVideojuego].personal_comment = this.comentario;
    }

    if (this.calificacion !== undefined) {
      this.videojuegos[this.indiceVideojuego].rating = this.calificacion;
    }

    // Actualizar en la BD
    this.videojuegoService.actualizarVideojuegoUsuario(this.videojuegos[this.indiceVideojuego])
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

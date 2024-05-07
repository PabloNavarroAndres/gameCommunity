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
      // console.log(data);
      this.videojuegos = data;
    })
  }

  // Activar modal detalles videojuego
  mostrarDetalles(indice: number) {
    this.indiceVideojuego = indice;
  }

  // Editar los detalles del videojuego
  editarDetalles() {

    // Los valores seleccionados están disponibles en las propiedades estadoJuego, comentario y calificacion
    console.log('Estado de juego:', this.estado);
    console.log('Comentario:', this.comentario);
    console.log('Calificación:', this.calificacion);
    console.log('id:', this.videojuegos[this.indiceVideojuego].game_id);

    // Vaciar campos de edición
    this.resetForm();
  }

  // Vaciar los campos del modo editar detalles
  resetForm() {
    // Vaciar los campos del modal de editar detalles si es necesario
    this.estado = '';
    this.comentario = '';
    this.calificacion = -1;
  }
  
}

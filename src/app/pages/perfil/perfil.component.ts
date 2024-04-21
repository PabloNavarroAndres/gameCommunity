import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  // Servicio de usuarios
  private _usuarioService = inject(UsuarioService);

  // Obtener el usuario con la sesión iniciada
  usuario = this._usuarioService.obtenerUsuarioIniciado() as User;

  // Imagenes de la carpeta
  imagenes = [
    '../../../assets/perfil/user.png',
    '../../../assets/perfil/man.png',
    '../../../assets/perfil/man_2.png',
    '../../../assets/perfil/man_3.png',
    '../../../assets/perfil/female.png',
    '../../../assets/perfil/gamer.png',
    '../../../assets/perfil/gamer_2.png',
  ];

  // Indice de la posicion de imagen en el array "imagenes"
  i = 0;

  // Propiedad calculada para obtener la imagen seleccionada
  get selectedImage(): string {
    return this.imagenes[this.i];
  }

  // Nombre del formulario
  nombre: string = '';

  // Al iniciarse buscamos la imagen del usuario
  ngOnInit(): void {
    // Pasamos el indice de la imagen del usuario al del array de imagenes
    this.i = this.imagenes.findIndex(imagen => this.usuario.profile_picture === imagen)
  }

  // Calcular la posicion anterior de la imagen del carrusel en el array
  anteriorImg() {
    if (this.i === 0) {
      this.i = this.imagenes.length-1;

    } else {
      this.i--;
    }
  }

  // Calcular la posicion siguiente de la imagen del carrusel en el array
  siguienteImg() {
    if (this.i === this.imagenes.length-1) {
      this.i = 0;

    } else {
      this.i++;
    }
  }

  // Actualizar la imagen del usuario
  actualizarPerfil() {

    // Nombre
    if (this.nombre !== '') {
      this.usuario.username = this.nombre;
    }

    // Foto de perfil
    this.usuario.profile_picture = this.selectedImage;
  }
}


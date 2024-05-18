import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, FormsModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  // Servicio de usuarios
  private _usuarioService = inject(UsuarioService);

  // Obtener el usuario con la sesión iniciada
  usuario!: User;

  // Desactivar modo edicion si se ha entrado por parametro de email
  modoEditar: boolean = true;

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

  userEmail: string = '';

  private route = inject(ActivatedRoute);

  // Al iniciarse buscamos la imagen del usuario
  ngOnInit(): void {

    // Buscamos datos de los parametros
    this.route.params.subscribe(params => {

      // Parametro de email usuario
      const userEmail = params['user_email'];

      // Si el email existe es que estamos visitando un perfil de otro usuario
      if (userEmail) {
        // Desactivamos el boton de editar
        this.modoEditar = false;

        // Si hay un parámetro de email en la URL, obtener el perfil del usuario correspondiente
        this._usuarioService.obtenerUsuarioPorEmail(userEmail)
        .subscribe({
          // Array de usuarios obtenido
          next: (user: User) => {
            console.log('Usuario obtenido por email: ', user);
    
            // Actualizar usuario
            this.usuario = user;
          },
          error: (error: any) => {
            console.error('Error al obtener el perfil del usuario:', error);
          }
        });

      // Si no existe simplemente es que estamos visitando nuestro perfil,
      // como usuario iniciado
      } else {
        // Activar boton de editar
        this.modoEditar = true;

        // Si no hay parámetro de email, obtener el usuario con la sesión iniciada
        this.usuario = this._usuarioService.obtenerUsuarioIniciado() as User;
      }
      // Pasamos el índice de la imagen del usuario al del array de imagenes
      this.i = this.imagenes.findIndex(imagen => this.usuario.profile_picture === imagen);
    });
    
  }

  // Calcular la posicion anterior de la imagen del carrusel en el array
  anteriorImg() {
    if (this.i === 0) {
      this.i = this.imagenes.length - 1;

    } else {
      this.i--;
    }
  }

  // Calcular la posicion siguiente de la imagen del carrusel en el array
  siguienteImg() {
    if (this.i === this.imagenes.length - 1) {
      this.i = 0;

    } else {
      this.i++;
    }
  }

  // Actualizar la imagen del usuario
  actualizarPerfil() {

    // Usuario con los nuevos datos
    const usuarioActualizado = { ...this.usuario };

    // Nombre
    if (this.nombre !== '') {
      usuarioActualizado.username = this.nombre;
    }
    // Foto de perfil
    usuarioActualizado.profile_picture = this.selectedImage;

    // Mandamos el usuario actualizado al servicio
    this._usuarioService.actualizarUsuario(usuarioActualizado)
    .subscribe({
      // Array de usuarios obtenido
      next: (response: User) => {
        console.log('Usuario actualizado correctamente', response);

        // Actualizar usuario iniciado
        this.usuario = usuarioActualizado;
      },
      error: (error: any) => {
        console.error('Error al obtener usuarios:', error);
      }
    });

  }

}


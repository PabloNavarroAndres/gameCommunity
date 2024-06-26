import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavegacionService } from '../../services/navegacion.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, FormsModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  // Referencia al boton de editar
  @ViewChild('openModalButton') openModalButton!: ElementRef;

  // Servicio de usuarios
  private _usuarioService = inject(UsuarioService);

  // Servicio de navegacion
  private _navegacionService = inject(NavegacionService);

  // Obtener el usuario con la sesión iniciada
  usuario: User | undefined;

  // Desactivar modo edicion si se ha entrado por parametro de email
  modoEditar: boolean = true;

  // Comprobar si se está editando por un admin
  modoEditarAdmin: boolean = false;

  // Usuario iniciado
  usuarioIniciado: User = this._usuarioService.obtenerUsuarioIniciado() as User;

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

  private shouldOpenModal = false;

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

            // Revisamos si hay parametro de editar por un administrador
            this.checkQueryParams();

            // Pasamos el índice de la imagen del usuario al del array de imagenes
            this.i = this.imagenes.findIndex(imagen => this.usuario?.profile_picture === imagen);

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

        // Pasamos el índice de la imagen del usuario al del array de imagenes
        this.i = this.imagenes.findIndex(imagen => this.usuario?.profile_picture === imagen);
      }
    });
    
  }

  // Inicialización del ViewChild en ngAfterViewInit,
  // para que esté disponible a llamar a openModal
  ngAfterViewInit(): void {
    if (this.shouldOpenModal && this.openModalButton) {
      this.openModal();
    }
  }

  // Comprobar parametro de editar (por un admin)
  private checkQueryParams(): void {

    this.route.queryParams.subscribe(params => {

      if (params['editar'] === 'true') {

        this.modoEditarAdmin = true;

        // Comprobar condicion para abrir modal
        this.shouldOpenModal = true;

        // Llamar a abrir el modal
        if (this.openModalButton) {
          this.openModal();
        }
      }

    });
  }

  // Abrir el modal de editar perfil
  openModal(): void {
    if (this.openModalButton) {
      this.openModalButton.nativeElement.click();
    }
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
    this._usuarioService.actualizarUsuario(usuarioActualizado as User)
    .subscribe({
      // Array de usuarios obtenido
      next: (response: User) => {
        console.log('Usuario actualizado correctamente', response);

        // Actualizar usuario iniciado
        this.usuario = usuarioActualizado as User;

        if(!this.modoEditarAdmin) {
          // Actualizar usuario iniciado
          this._usuarioService.agregarUsuarioIniciado(usuarioActualizado as User);
        }
      },
      error: (error: any) => {
        console.error('Error al obtener usuarios:', error);
      }
    });

  }

  cambiarIndice(indice: number) {
    this.i = indice;
  }

  // Volver hacia atras
  goBack(): void {
    this._navegacionService.goBack();
  }

}

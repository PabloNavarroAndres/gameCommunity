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
  @ViewChild('EditarPerfilModal') EditarPerfilModal!: ElementRef;

  // Servicio de usuarios
  private _usuarioService = inject(UsuarioService);

  // Servicio de navegacion
  private _navegacionService = inject(NavegacionService);

  // Obtener el usuario con la sesión iniciada
  usuario: User | undefined;

  // Usuarios de la web
  usuarios: User[] = [];

  // Condicion para mostrar mensaje de nombre de usuario existente
  nombreExistente: boolean = false;

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
    this.route.params.subscribe(params => {

      const userEmail = params['user_email'];

      // Si existe el parametro del email de usuario..
      if (userEmail) {

        // Desactivar modo editar (se está visitando un perfil)
        this.modoEditar = false;

        // Obtener objeto de usuario
        this._usuarioService.obtenerUsuarioPorEmail(userEmail)
          .subscribe({
            next: (user: User) => {

              // Actualizar perfil al usuario obtenido
              this.usuario = user;

              // Comprobar parametro de editar por administrador
              this.checkQueryParams();

              // Actualizar la posicion de la imagen de usuario
              this.i = this.imagenes.findIndex(imagen => this.usuario?.profile_picture === imagen);
            },
            error: (error: any) => {
              console.error('Error al obtener el perfil del usuario:', error);
            }
          });

      } else {
        // Si no hay parámetros es que es nuestro perfil, se activa el modo editar
        this.modoEditar = true;

        // El perfil muestra al usuario iniciado
        this.usuario = this._usuarioService.obtenerUsuarioIniciado() as User;

        // Actualizamos la posicion de la imagen de usuario en el array de imagenes
        this.i = this.imagenes.findIndex(imagen => this.usuario?.profile_picture === imagen);
      }
    });

    // Obtenemos los usuarios
    this._usuarioService.obtenerUsuarios()
      .subscribe((usuarios: User[]) => {
        this.usuarios = usuarios;
      });
  }

  // Inicialización del ViewChild en ngAfterViewInit,
  // para que esté disponible al llamar a openModal
  ngAfterViewInit(): void {

    setTimeout(() => {
      if (this.shouldOpenModal && this.openModalButton) {
        this.openModal();
      }
    }, 100);
  }

  // Comprobar parametro de editar (por un admin)
  private checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['editar'] === 'true') {
        // Si esta el modo editar activamos el modo editar por administrador,
        // además de la condicion de abrir modal
        this.modoEditarAdmin = true;
        this.shouldOpenModal = true;
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

    // Quitamos los espacios del nuevo nombre
    this.nombre = this.nombre.trim();

    // Si el nombre está vacio se deja como estaba antes
    if (this.nombre !== '') {
      usuarioActualizado.username = this.nombre;
    }

    // Se comprueba si el nombre nuevo coincide con uno existente
    for (const usuario of this.usuarios) {
      if (this.nombre === usuario.username) {
        
        console.log('Usuario ya existe');

        // Activar la condicion de que el nombre existe
        // (esto activará el mensaje que lo indica)
        this.nombreExistente = true;

        // Desactivar el mensaje después de 5 segundos
        setTimeout(() => {
          this.nombreExistente = false;
        }, 5000);

        // Vaciar campo de nombre
        this.nombre = '';

        return;
      }
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

        // Cambiar el nombre del array de usuarios
        for (const usuario of this.usuarios) {
          if (usuarioActualizado.email === usuario.email) {
            usuario.username = this.nombre;
          }
        }

        // Si no es un administrador el perfil iniciado se actualiza con
        // los nuevos datos
        if(!this.modoEditarAdmin) {
          // Actualizar usuario iniciado
          this._usuarioService.agregarUsuarioIniciado(usuarioActualizado as User);
        }

        // Cerramos el modal de editar
        this.closeModal();

        // Vaciamos el campo del nombre de usuario
        this.nombre = '';
      },
      error: (error: any) => {
        console.error('Error al obtener usuarios:', error);
      }
    });

  }

   // Cerrar el modal de editar
  closeModal() {
    // Obtener el elemento del DOM
    const modalElement = document.getElementById('EditarPerfilModal');
    if (modalElement) {
      // Obtener la referencia modal del elemento
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        // Cerrarlo manualmente
        modal.hide();
      }
    }
  }

  cambiarIndice(indice: number) {
    this.i = indice;
  }

  // Volver hacia atras
  goBack(): void {
    this._navegacionService.goBack();
  }

}

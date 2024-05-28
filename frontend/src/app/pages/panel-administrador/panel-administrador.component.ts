import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'; 
import { Router, RouterLink } from '@angular/router';
import { Comunidad } from '../../models/comunidad.interface';
import { User } from '../../models/user.interface';
import { UsuarioComunidad } from '../../models/usuarioComunidad.interface';
import { ComunidadesService } from '../../services/comunidades.service';
import { UsuarioService } from '../../services/usuarios.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../models/videojuego.interface';

@Component({
  selector: 'app-panel-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, MatTabsModule, RouterLink, TruncatePipe],
  templateUrl: './panel-administrador.component.html',
  styleUrl: './panel-administrador.component.css'
})
export class PanelAdministradorComponent {

  // Servicio de usuarios
  private _usuarioService = inject(UsuarioService);

  // Servicio de comunidades
  private _comunidadService = inject(ComunidadesService);

  // Servicio de videojuegos
  private _videojuegoService = inject(VideojuegosService);

  // Servicio de las rutas
  private router = inject(Router);

  // Usuario iniciado
  usuarioIniciado: User = this._usuarioService.obtenerUsuarioIniciado() as User;

  // Array comunidades
  comunidades: Comunidad[] = [];

  // Array usuarios
  usuarios: User[] = [];

  // Array videojuegos
  videojuegos: Videojuego[] = [];

  // Usuarios de la comunidad activa
  usuariosComunidad: UsuarioComunidad[] = [];

  // Formulario Registro
  formularioVideojuego: FormGroup;

  // Condiciones para mostrar mensajes de videojuego
  videojuegoExiste: boolean = false;
  videojuegoCreado: boolean = false;

  // Archivo de imagen seleccionado
  archivoSeleccionado: File | null = null;

  constructor(private form: FormBuilder) {

    // Añadir validadores a los campos del formulario
    this.formularioVideojuego = this.form.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      imagen: [null, Validators.required]
    });

  }

  ngOnInit(): void {

    // Obtenemos usuarios al iniciar componente
    this._usuarioService.obtenerUsuarios()
    .subscribe((data: User[]) => {
      console.log(data);
      this.usuarios = data;
    });

    // Obtener comunidades de la BD
    this._comunidadService.obtenerComunidades()
    .subscribe({
      next: (comunidades: Comunidad[]) => {
        // Establecemos las comunidades obtenidas
        this.comunidades = comunidades;
        console.log(this.comunidades);
      },
      error: (error: any) => {
        console.error('Error al obtener comunidades:', error);
      }
    });

    // Obtener videojuegos de la BD
    this.obtenerVideojuegos();
  }

  // Ir a editar el perfil de usuario
  navegarAlPerfil(email: string): void {
    this.router.navigate(['/perfil', email], { queryParams: { editar: 'true' } });
  }

  // Eliminar usuario de la web
  eliminarUsuario(email: string, indiceArray: number) {
    // Si el usuario a eliminar es administrador también y no somos
    // el superadministrador de la web no podremos eliminarlo
    if ((this.usuarios[indiceArray].isAdmin && this.usuarioIniciado.email === 'admin@gmail.com') || 
      !this.usuarios[indiceArray].isAdmin ) {

      this._usuarioService.eliminarUsuario(email)
      .subscribe({

        next: (response: any) => {
          console.log('Eliminando usuario del servidor:', response);

          // Eliminar el usuario del array
          this.usuarios.splice(indiceArray, 1);
        },

        error: (error: any) => {
          console.error('Error intentando eliminar el usuario:', error);
        }
      });

    } else {
      console.error('No puedes eliminar a un usuario administrador sin ser un superadmin');
    }

  }

  // Eliminar comunidad de la web
  eliminarComunidad(community_id: number | undefined, indiceArray: number) {
    if (community_id) {
      // Convertimos a tipo numerico
      community_id = community_id as number;

      this._comunidadService.eliminarComunidad(community_id)
      .subscribe({
        next: (response: any) => {
          console.log('Eliminando comunidad del servidor:', response);

          // Eliminar la comunidad del array
          this.comunidades.splice(indiceArray, 1);
        },
        error: (error: any) => {
          console.error('Error intentando eliminar la comunidad:', error);
        }
      });
    }
  }

  // Hacer usuario administrador de la web
  hacerAdministrador(email: string, indiceArray: number) {
    this._usuarioService.hacerAdministrador(email)
    .subscribe({
      next: (response: any) => {
        console.log('Haciendo admin al usuario en el servidor:', response);
        // Hacer admin al usuario del array
        this.usuarios[indiceArray].isAdmin = 1;
      },
      error: (error: any) => {
        console.error('Error intentando hacer admin al usuario:', error);
      }
    });
  }

  // Hacer usuario administrador de la web
  quitarAdministrador(email: string, indiceArray: number) {
    this._usuarioService.quitarAdministrador(email)
    .subscribe({
      next: (response: any) => {
        console.log('Quitando admin al usuario en el servidor:', response);
        // Quitar admin al usuario del array
        this.usuarios[indiceArray].isAdmin = 0;
      },
      error: (error: any) => {
        console.error('Error intentando quitar admin al usuario:', error);
      }
    });
  }

  // Comprobar error del campo de nombre
  hasErrors(controlName: string, errorType: string) {
    // Obtenemos el tipo de campo que queremos controlar
    const control = this.formularioVideojuego.get(controlName);
    // Comprobamos si nos devuelve el error pasado como parametro,
    // los validadores del formulario devuelven true si el error indicado
    // está presente
    return control?.hasError(errorType) && control?.touched;
  }

  // Detectar cuando seleccionas la imagen del videojuego
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.formularioVideojuego.patchValue({
        imagen: file
      });
      this.formularioVideojuego.get('imagen')?.updateValueAndValidity();
    }
  }

  obtenerVideojuegos() {
    this._videojuegoService.obtenerVideojuegos().subscribe({
        next: (videojuegos: any) => {
            this.videojuegos = videojuegos;
        },
        error: (error: any) => {
            console.error('Error al actualizar lista de videojuegos:', error);
        }
    });
}

  crearVideojuego() {
    if (this.formularioVideojuego.valid && this.archivoSeleccionado) {
      const formData = new FormData();
      formData.append('titulo', this.formularioVideojuego.get('titulo')?.value);
      formData.append('imagen', this.archivoSeleccionado);

      // Buscar titulo del videojuego en el array de videojuegos
      const videojuegoEncontrado = this.videojuegos.find(
        videojuego => videojuego.title === formData.get('titulo')
      );

      // El nombre de la videojuego ya existe en la bd
      if (videojuegoEncontrado) {
        console.log('El videojuego ya existe');

        // Activar la condicion de videojuego ya existe
        // (esto activará el mensaje que lo indica)
        this.videojuegoExiste = true;

        // Desactivar el mensaje de error después de 5 segundos
        setTimeout(() => {
          this.videojuegoExiste = false;
        }, 4000);
      } else {
        // Crear el videojuego en la BD
        this._videojuegoService.crearVideojuego(formData)
        .subscribe({
          next: (response: any) => {
            this.formularioVideojuego.reset();
            this.archivoSeleccionado = null;

            // Actualizar la lista de videojuegos
            this.obtenerVideojuegos();

            // Activar la condicion de videojuego creado
            // (esto activará el mensaje que lo indica)
            this.videojuegoCreado = true;

            // Desactivar el mensaje de error después de 5 segundos
            setTimeout(() => {
              this.videojuegoCreado = false;
            }, 4000);
          },
          error: (error: any) => {
            console.error('Error al crear videojuego:', error);

            if (error.status === 409) { // Asumiendo que el error 409 significa que el videojuego ya existe
              this.videojuegoExiste = true;
            }
          }
        });
      }
    } else {
      console.log('Formulario no válido o archivo no seleccionado');
    }
  }

  // Comprobar si el videojuego existe en la BD
  msjTituloExiste() {
    return this.videojuegoExiste;
  }

  // Activar mensaje de videojuego creado
  msjVideojuegoCreado() {
    return this.videojuegoCreado;
  }
}

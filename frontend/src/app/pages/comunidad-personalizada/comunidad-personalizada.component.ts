import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ComunidadesService } from '../../services/comunidades.service';
import { Comunidad } from '../../models/comunidad.interface';
import { UsuarioComunidad } from '../../models/usuarioComunidad.interface';
import { UsuariosComunidadService } from '../../services/usuarios-comunidad.service';

@Component({
  selector: 'app-comunidad-personalizada',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './comunidad-personalizada.component.html',
  styleUrl: './comunidad-personalizada.component.css'
})
export class ComunidadPersonalizadaComponent {

  verComunidad: boolean = false;
  formularioComunidad: boolean = false;

  // Servicio de comunidades
  private _comunidadService = inject(ComunidadesService);

  // Servicio de comunidades
  private _usuariosComunidadService = inject(UsuariosComunidadService);

  // Servicio ruta parametros
  private route = inject(ActivatedRoute);

  // Array comunidades
  comunidades: Comunidad[] = [];

  // Comunidad a la que se ha entrado
  comunidadActiva?: Comunidad;

  // Usuarios de la comunidad activa
  usuariosComunidad: UsuarioComunidad[] = [];

  ngOnInit(): void {

    // Comprobamos si se han pasado parametros,
    // de ver comunidad personalizada
    this.route.params.subscribe(params => {

      // Parametro de id de comunidad
      const idComunidad: number = params['comunidadId'];
      
      // Si el idComunidad existe es que estamos visitando una comunidad
      if (idComunidad) {

        // Guardamos la comunidad buscada por id
        this.comunidadActiva = this.comunidades.find(comunidad => idComunidad === comunidad.community_id);

        // Activamos el modo de ver comunidad
        this.verComunidad = true;

        // Buscamos los usuarios de esa comunidad (usuariosComunidad)
        this._usuariosComunidadService.obtenerUsuariosComunidad(idComunidad)
        .subscribe({
          // Array de usuarios obtenido
          next: (usuarios: UsuarioComunidad[]) => {
            
            this.usuariosComunidad = usuarios;
            console.log('Usuarios de comunidad obtenidos: ', usuarios);

          },
          error: (error: any) => {
            console.error('Error al obtener usuarios de comunidad:', error);
          }
        });


        // Si hay un parámetro de email en la URL, obtener el perfil del usuario correspondiente
        /* this._usuarioService.obtenerUsuarioPorEmail(userEmail)
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
 */
        // Si no existe simplemente es que estamos visitando nuestro perfil,
        // como usuario iniciado
      } else {
        // Activar boton de editar
        this.verComunidad = false;

        // Si no hay parámetro de email, obtener el usuario con la sesión iniciada
/*         this.usuario = this._usuarioService.obtenerUsuarioIniciado() as User;
 */      }
      // Pasamos el índice de la imagen del usuario al del array de imagenes
/*       this.i = this.imagenes.findIndex(imagen => this.usuario.profile_picture === imagen);
 */
    });

    // Obtener comunidades
    // Obtener las comunidades de la BD
    this._comunidadService.obtenerComunidades()
      .subscribe({
        next: (comunidades: Comunidad[]) => {
          this.comunidades = comunidades;
          console.log('Comunidad cargada desde la BD:');
          console.log(this.comunidades)
        },
        error: (error: any) => {
          console.error('Error al obtener comunidades:', error);
        }
      });
  }

  // Activar/Desactivar formulario
  mostrarFormulario() {
    this.formularioComunidad = !this.formularioComunidad;
  }

}

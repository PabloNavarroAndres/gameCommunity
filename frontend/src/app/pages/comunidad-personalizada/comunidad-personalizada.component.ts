import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ComunidadesService } from '../../services/comunidades.service';
import { Comunidad } from '../../models/comunidad.interface';
import { UsuarioComunidad } from '../../models/usuarioComunidad.interface';
import { UsuariosComunidadService } from '../../services/usuarios-comunidad.service';
import { NavegacionService } from '../../services/navegacion.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { User } from '../../models/user.interface';
import { UsuarioService } from '../../services/usuarios.service';


@Component({
  selector: 'app-comunidad-personalizada',
  standalone: true,
  imports: [RouterLink, TruncatePipe],
  templateUrl: './comunidad-personalizada.component.html',
  styleUrl: './comunidad-personalizada.component.css'
})
export class ComunidadPersonalizadaComponent {

  verComunidad: boolean = false;
  formularioComunidad: boolean = false;

  // Servicio de comunidades
  private _usuarioService= inject(UsuarioService);

  // Servicio de comunidades
  private _comunidadService = inject(ComunidadesService);

  // Servicio de comunidades
  private _usuariosComunidadService = inject(UsuariosComunidadService);

  // Servicio de navegacion
  private _navegacionService = inject(NavegacionService);

  // Servicio ruta parametros
  private route = inject(ActivatedRoute);

  // Usuario iniciado
  usuarioIniciado: User = this._usuarioService.obtenerUsuarioIniciado() as User;

  // Array comunidades
  comunidades: Comunidad[] = [];

  // Comunidad a la que se ha entrado
  comunidadActiva?: Comunidad;

  // Usuarios de la comunidad activa
  usuariosComunidad: UsuarioComunidad[] = [];

  ngOnInit(): void {

    // Comprobamos si se han pasado parametros, de ver comunidad personalizada
    this.route.params.subscribe(params => {

      // Parametro de id de comunidad
      const idComunidad: number = +params['comunidadId'];

      // Obtener comunidades de la BD
      this._comunidadService.obtenerComunidades()
        .subscribe({
          next: (comunidades: Comunidad[]) => {

            // Establecemos las comunidades obtenidas
            this.comunidades = comunidades;

            // Si el idComunidad existe es que estamos visitando una comunidad
            if (idComunidad) {

              // Guardamos la comunidad buscada por id
              this.comunidadActiva = this.comunidades.find(comunidad => {
                return idComunidad === comunidad.community_id;
              });

              // Guardamos la comunidad que visitamos como la activa
              if (this.comunidadActiva) {
                console.log('Comunidad activa encontrada:', this.comunidadActiva);

                // Activamos el modo de ver comunidad activa
                this.verComunidad = true;

                // Buscamos los usuarios de esa comunidad
                this._usuariosComunidadService.obtenerUsuariosComunidad(idComunidad)
                  .subscribe({
                    next: (usuarios: UsuarioComunidad[]) => {
                      this.usuariosComunidad = usuarios;
                      console.log(this.usuariosComunidad);
                      console.log('Usuarios de comunidad obtenidos:', usuarios);
                    },
                    error: (error: any) => {
                      console.error('Error al obtener usuarios de comunidad:', error);
                    }
                  });
              } else {
                console.error('No se encontró la comunidad activa.');
              }
            } else {
              // Si no existe simplemente es que estamos visitando nuestro perfil,
              // como usuario iniciado
              this.verComunidad = false;
            }
          },
          error: (error: any) => {
            console.error('Error al obtener comunidades:', error);
          }
        });
    });
  }

  // Agregar usuario iniciado
  unirseComunidad() {
    // Buscamos si el usuario existe
    const usuarioExiste = this.usuariosComunidad.find(usuario => {usuario.user_email === this.usuarioIniciado.email});

    if (usuarioExiste) {

      console.log('El usuario ya existe');

    } else {      

      const usuarioComunidad: UsuarioComunidad = {
        user_email: this.usuarioIniciado.email,
        community_id: this.comunidadActiva?.community_id as number,
        isCreator:  0,
        isAdmin:  this.usuarioIniciado.isAdmin as number,
        username:  this.usuarioIniciado.username,
        total_games:  this.usuarioIniciado.total_games
      };

      this._usuariosComunidadService.agregarUsuarioComunidad(usuarioComunidad)
      .subscribe({
        next: (response: any) => {
          console.log('Usuario agregado correctamente:', response);
          this.usuariosComunidad.push(usuarioComunidad);
        },
        error: (error: any) => {
          console.error('Error al agregar usuario:', error);
        }
      });
    }

  }

  // Activar/Desactivar formulario
  mostrarFormulario() {
    this.formularioComunidad = !this.formularioComunidad;
  }

  // Volver hacia atras
  goBack(): void {
    this._navegacionService.goBack();
  }

}

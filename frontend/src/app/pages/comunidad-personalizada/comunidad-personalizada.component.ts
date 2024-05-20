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

            /* console.log('Comunidades cargadas desde la BD:', this.comunidades); */

            // Si el idComunidad existe es que estamos visitando una comunidad
            if (idComunidad) {

              /* console.log('Tipo de idComunidad:', typeof idComunidad); // Verifica el tipo de idComunidad
              console.log('ID de Comunidad:', idComunidad);

              this.comunidades.forEach(comunidad => {
                console.log('Verificando comunidad:', comunidad);
              }); */

              // Guardamos la comunidad buscada por id
              this.comunidadActiva = this.comunidades.find(comunidad => {
                console.log('Comparando:', idComunidad, 'con', comunidad.community_id);
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


  // Activar/Desactivar formulario
  mostrarFormulario() {
    this.formularioComunidad = !this.formularioComunidad;
  }

}

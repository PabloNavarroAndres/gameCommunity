import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'; 
import { Router, RouterLink } from '@angular/router';
import { Comunidad } from '../../models/comunidad.interface';
import { User } from '../../models/user.interface';
import { UsuarioComunidad } from '../../models/usuarioComunidad.interface';
import { ComunidadesService } from '../../services/comunidades.service';
import { UsuarioService } from '../../services/usuarios.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-panel-administrador',
  standalone: true,
  imports: [MatTabsModule, RouterLink, TruncatePipe],
  templateUrl: './panel-administrador.component.html',
  styleUrl: './panel-administrador.component.css'
})
export class PanelAdministradorComponent {

  // Servicio de usuarios
  private _usuarioService= inject(UsuarioService);

  // Servicio de comunidades
  private _comunidadService = inject(ComunidadesService);

  // Servicio de las rutas
  private router = inject(Router);

  // Usuario iniciado
  usuarioIniciado: User = this._usuarioService.obtenerUsuarioIniciado() as User;

  // Array comunidades
  comunidades: Comunidad[] = [];

  // Array usuarios
  usuarios: User[] = [];

  // Usuarios de la comunidad activa
  usuariosComunidad: UsuarioComunidad[] = [];

  ngOnInit(): void {

    // Obtenemos usuarios al iniciar componente
    this._usuarioService.obtenerUsuarios()
    .subscribe((data: User[]) => {
      console.log(data);
      this.usuarios = data;
    })

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
  }

  // Ir a editar el perfil de usuario
  navegarAlPerfil(email: string): void {
    this.router.navigate(['/perfil', email], { queryParams: { editar: 'true' } });
  }

  // Eliminar usuario de la web
  eliminarUsuario(email: string, indiceArray: number) {

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


}

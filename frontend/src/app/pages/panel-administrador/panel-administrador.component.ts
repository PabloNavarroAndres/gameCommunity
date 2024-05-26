import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'; 
import { Router, RouterLink } from '@angular/router';
import { Comunidad } from '../../models/comunidad.interface';
import { User } from '../../models/user.interface';
import { UsuarioComunidad } from '../../models/usuarioComunidad.interface';
import { ComunidadesService } from '../../services/comunidades.service';
import { UsuarioService } from '../../services/usuarios.service';

@Component({
  selector: 'app-panel-administrador',
  standalone: true,
  imports: [MatTabsModule, RouterLink],
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

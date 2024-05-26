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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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


}

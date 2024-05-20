import { Component, inject } from '@angular/core';
import { User } from '../../models/user.interface';
import { UsuarioService } from '../../services/usuarios.service';
import { RouterLink } from '@angular/router';
import { NavegacionService } from '../../services/navegacion.service';

@Component({
  selector: 'app-comunidad-global',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './comunidad-global.component.html',
  styleUrl: './comunidad-global.component.css'
})
export class ComunidadGlobalComponent {

  // Servicio usuario
  _usuariosService = inject(UsuarioService);

  // Servicio de navegacion
  private _navegacionService = inject(NavegacionService);

  // Usuarios de la web
  usuarios!: User[];

  // Usuario iniciado
  usuarioIniciado?: User = this._usuariosService.obtenerUsuarioIniciado() as User;

  ngOnInit(): void {
    // Obtenemos usuarios al iniciar componente
    this._usuariosService.obtenerUsuarios()
    .subscribe((data: User[]) => {
      console.log(data);
      this.usuarios = data;
    })
  }

  // Volver hacia atras
  goBack(): void {
    this._navegacionService.goBack();
  }

}

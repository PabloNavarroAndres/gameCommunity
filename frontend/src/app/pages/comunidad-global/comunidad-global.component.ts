import { Component, inject } from '@angular/core';
import { User } from '../../models/user.interface';
import { UsuarioService } from '../../services/usuarios.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comunidad-global',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './comunidad-global.component.html',
  styleUrl: './comunidad-global.component.css'
})
export class ComunidadGlobalComponent {

  _usuariosService = inject(UsuarioService);

  usuarios!: User[];
  usuarioIniciado: User = this._usuariosService.obtenerUsuarioIniciado() as User;

  ngOnInit(): void {
    this._usuariosService.obtenerUsuarios()
    .subscribe((data: User[]) => {
      console.log(data);
      this.usuarios = data;
    })
  }

}

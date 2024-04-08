import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  // Servicio de usuarios
  private usuarioService = inject(UsuarioService);

  // Obtener el usuario con la sesión iniciada
  usuario = this.usuarioService.obtenerUsuarioIniciado() as User;
}

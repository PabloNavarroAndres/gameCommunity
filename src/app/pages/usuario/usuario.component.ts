import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  
  usuarios: User[] = [];

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe((data: User[]) => {
      console.log(data);
      this.usuarios = data;
    })
  }

  /*
  agregarUsuario(): void {
    const nuevoUsuario = {
      email: 'nuevo@example.com',
      username: 'nuevo',
      password: '123456',
      profile_picture: '',
      total_games: 0,
      isAdmin: 0
    };

    this.usuarioService.agregarUsuario(nuevoUsuario)
      .subscribe(
        (        response: any) => {
          console.log('Usuario agregado correctamente:', response);
          // Actualizar la lista de usuarios después de agregar uno nuevo
          this.obtenerUsuarios();
        },
        (        error: any) => {
          console.error('Error al agregar usuario:', error);
        }
      );
  }
  */

}

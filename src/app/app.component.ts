import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { RegistroService } from './services/registro.service';
import { UsuarioService } from './services/usuarios.service';
import { User } from './models/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'gameCommunity';
  // Mostrar el componente login
  private showLogin: boolean = false;

  constructor(
    private router: Router, 
    private loginService: LoginService, 
    private usuariosService: UsuarioService,
    private registroService: RegistroService) {
  }

  // Detectar en que ruta estas, para mostrar la opción del
  // menú solo en las rutas permitidas
  shouldShowThis(pageOption: string): boolean {

    // Guardar la ruta actual
    const currentRoute = this.router.url;
    // Guardar la pagina que deberia mostrar
    const page = pageOption;

    // Segun la ruta, mostramos verdadero en las permitidas
    switch (page) {
      case 'home':
        return currentRoute === '' || currentRoute === '/';
    
      case 'home':
        return currentRoute === '' || currentRoute === '/';

      case 'biblioteca':
        return currentRoute === '';

      case 'perfil':
        const sesionIniciada = localStorage.getItem('usuarioIniciado');
        // Tiene que devolver falso para que no se muestre,
        // en caso de que no tenga nada el sessionStorage
        return sesionIniciada !== null;

      default:
        return false;
    }

  }

  // Al dar click a login, activara el componente
  toggleLogin() {
    if (!this.registroService.shouldShowRegistro()) {
      this.loginService.toggleLogin();
    } else {
      this.loginService.toggleLogin();
      this.registroService.toggleRegistro();
    }
  }

  // Al dar click a registro, activara el componente
  toggleRegistro() {
    if (!this.loginService.shouldShowLogin()) {
      this.registroService.toggleRegistro();
    } else {
      this.loginService.toggleLogin();
      this.registroService.toggleRegistro();
    }
  }

  // Cerrar sesión borrando el local storage del usuario iniciado
  cerrarSesion() {
    this.usuariosService.borrarUsuarioIniciado();
    console.log('Sesion cerrada, valor del local storage: ' + this.usuariosService.obtenerUsuarioIniciado());
  }

}

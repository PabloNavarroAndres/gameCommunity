import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { RegistroService } from './services/registro.service';

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
    private registroService: RegistroService) {
  }

  // Detectar si estas en home, para mostrar botones del nav "login" y "registro"
  shouldShowLoginAndRegister(): boolean {
    // Guardar la ruta actual
    const currentRoute = this.router.url;

    // Comprobar si se corresponde la ruta actual con esta
    return currentRoute === '' || currentRoute === '/';
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

}

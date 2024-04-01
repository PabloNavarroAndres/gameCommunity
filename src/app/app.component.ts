import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';

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

  constructor(private router: Router, private loginService: LoginService) {}

  // Funcion para detectar si estas en home, para mostrar botones del nav "login" y "registro"
  shouldShowLoginAndRegister(): boolean {
    const currentRoute = this.router.url;

    return currentRoute === '' || currentRoute === '/';
  }

  // Al dar click a login, activara el componente
  toggleLogin() {
    this.loginService.toggleLogin();
  }

  

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsuarioComponent } from "../usuario/usuario.component";
import { LoginService } from '../../services/login.service';
import { LoginComponent } from '../login/login.component';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CommonModule, UsuarioComponent, LoginComponent]
})
export class HomeComponent {
    constructor(private loginService: LoginService) {}

    // Activar o desactivar el componente de login
  shouldShowLogin(): boolean {
    return this.loginService.shouldShowLogin();
  }
}

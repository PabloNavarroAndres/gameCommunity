import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { LoginComponent } from '../login/login.component';
import { RegistroComponent } from "../registro/registro.component";
import { RegistroService } from '../../services/registro.service';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CommonModule, LoginComponent, RegistroComponent]
})
export class HomeComponent {

    // Servicios
    private loginService = inject(LoginService);
    private registroService = inject(RegistroService);

    // Cuando se cambie de ruta desactivaremos la vista 
    // del login y registro del home, si estuviesen activas
    ngOnDestroy(): void {
        if (this.shouldShowLogin()) {
            this.loginService.toggleLogin();
        }

        if (this.shouldShowRegistro()) {
            this.registroService.toggleRegistro();
        }
    }

    // Comprobar si se debe mostrar el componente del login
    shouldShowLogin(): boolean {
        return this.loginService.shouldShowLogin();
    }

    // Comprobar si se debe mostrar el componente del registro
    shouldShowRegistro(): boolean {
        return this.registroService.shouldShowRegistro();
    }

    // Abrir el registro
    toggleRegistro(): void {
        this.registroService.toggleRegistro();
    }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsuarioComponent } from "../usuario/usuario.component";


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CommonModule, UsuarioComponent]
})
export class HomeComponent {

}

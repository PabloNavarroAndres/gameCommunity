import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comunidad-personalizada',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './comunidad-personalizada.component.html',
  styleUrl: './comunidad-personalizada.component.css'
})
export class ComunidadPersonalizadaComponent {

  verComunidad: boolean = false;
  formularioComunidad: boolean = false;

  
  // Activar/Desactivar formulario
  mostrarFormulario() {
    this.formularioComunidad = !this.formularioComunidad;
  }

}

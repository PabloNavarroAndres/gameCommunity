import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComunidadesService } from '../../services/comunidades.service';
import { Comunidad } from '../../models/comunidad.interface';

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

  // Servicio de comunidades
  private _comunidadService = inject(ComunidadesService);

  // Array comunidades
  comunidades: Comunidad[] = [];

  ngOnInit(): void {
    // Obtener comunidades
    // Obtener las comunidades de la BD
    this._comunidadService.obtenerComunidades()
    .subscribe({
      next: (comunidades: Comunidad[]) => {
        this.comunidades = comunidades;
        console.log('Comunidad cargada desde la BD:');
        console.log(this.comunidades)
      },
      error: (error: any) => {
        console.error('Error al obtener comunidades:', error);
      }
    });
  }

  // Activar/Desactivar formulario
  mostrarFormulario() {
    this.formularioComunidad = !this.formularioComunidad;
  }

}

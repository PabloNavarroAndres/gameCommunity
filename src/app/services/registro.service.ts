import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  // Mostrar componente registro o no
  protected showRegistro: boolean = false;

  // Comprobar si deberia mostrarse o no el registro
  shouldShowRegistro(): boolean {
    return this.showRegistro;
  }

  // Activar o desactivar mostrar registro
  toggleRegistro() {
    this.showRegistro = !this.showRegistro;
  }
}

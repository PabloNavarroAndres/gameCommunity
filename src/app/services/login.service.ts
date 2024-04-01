import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Mostrar componente login o no
  protected showLogin: boolean = false;

  // Comprobar si deberia mostrarse o no el login
  shouldShowLogin(): boolean {
    return this.showLogin;
  }

  // Activar o desactivar mostrar login
  toggleLogin() {
    this.showLogin = !this.showLogin;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Mostrar componente login o no
  private showLogin: boolean = false;

  // Comprobar si deberia mostrarse o no el login
  shouldShowLogin(): boolean {
    console.log('toggle estado: ' + this.showLogin);
    return this.showLogin;
  }

  // Activar o desactivar mostrar login
  toggleLogin() {
    console.log('toggle de ' + this.showLogin);
    this.showLogin = !this.showLogin;
    console.log('toggle a ' + this.showLogin);
  }
}

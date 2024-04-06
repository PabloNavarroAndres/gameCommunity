import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private url = 'http://localhost/gameCommunity/src/server/usuarios.php';

  private _http = inject(HttpClient);

  obtenerUsuarios():Observable<User[]>{
    return this._http.get<User[]>(`${this.url}?action=obtenerUsuarios`);
  }

  agregarUsuario(usuario: User): Observable<User> {
    return this._http.post<User>(`${this.url}?action=agregarUsuario`, usuario);
  }
}

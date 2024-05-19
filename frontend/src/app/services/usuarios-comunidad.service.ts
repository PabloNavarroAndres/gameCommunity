import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioComunidad } from '../models/usuarioComunidad.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosComunidadService {

  private url = 'http://localhost/gameCommunity/backend/src/index.php';

  private _http = inject(HttpClient);

  obtenerUsuariosComunidad(id: number):Observable<UsuarioComunidad[]>{
    return this._http.get<UsuarioComunidad[]>(`${this.url}?controller=comunidadUsuario&action=obtenerUsuariosComunidad&community_id=${id}`);
  }

  agregarUsuarioComunidad(usuarioComunidad: UsuarioComunidad):Observable<UsuarioComunidad> {
    return this._http.post<UsuarioComunidad>(`${this.url}?controller=comunidadUsuario&action=agregarUsuarioComunidad`, usuarioComunidad);
  }

  actualizarUsuarioComunidad(usuarioComunidad: UsuarioComunidad):Observable<UsuarioComunidad> {
    return this._http.put<UsuarioComunidad>(`${this.url}?controller=comunidadUsuario&action=actualizarUsuarioComunidad`, usuarioComunidad);
  }

  eliminarUsuarioComunidad(usuarioComunidad: UsuarioComunidad):Observable<UsuarioComunidad> {
    return this._http.put<UsuarioComunidad>(`${this.url}?controller=comunidadUsuario&action=eliminarUsuarioComunidad`, usuarioComunidad);
  }

}


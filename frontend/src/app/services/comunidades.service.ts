import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Comunidad } from '../models/comunidad.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ComunidadesService {

  private url = 'http://localhost/gameCommunity/backend/src/index.php';

  private _http = inject(HttpClient);

  // Obtener comunidades
  obtenerComunidades(): Observable<Comunidad[]> {
    return this._http.get<Comunidad[]>(`${this.url}?controller=comunidades&action=obtenerComunidades`);
  }

  // Obtener comunidad por id
  obtenerComunidad(community_id: number): Observable<Comunidad> {
    return this._http.get<Comunidad>(`${this.url}?controller=comunidades&action=obtenerComunidad&community_id=${community_id}`);
  }

  // Insertar comunidad
  agregarComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this._http.post<Comunidad>(`${this.url}?controller=comunidades&action=agregarComunidad`, comunidad);
  }

  // Obtener comunidad
  eliminarComunidad(community_id: number): Observable<Comunidad> {
    return this._http.delete<Comunidad>(`${this.url}?controller=comunidades&action=eliminarComunidad&community_id=${community_id}`);
  }

  // Actualizar comunidad
  actualizarComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this._http.put<Comunidad>(`${this.url}?controller=comunidades&action=actualizarComunidad`, comunidad);
  }

  
}

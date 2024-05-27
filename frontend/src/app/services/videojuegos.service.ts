import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego.interface';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  private url = 'http://localhost/gameCommunity/backend/src/index.php';

  private _http = inject(HttpClient);

  obtenerVideojuegos(): Observable<Videojuego[]> {
    return this._http.get<Videojuego[]>(`${this.url}?controller=videojuegos&action=obtenerVideojuegos`);
  }

  obtenerVideojuegosUsuario(email: string): Observable<Videojuego[]> {
    return this._http.get<Videojuego[]>(`${this.url}?controller=videojuegos&action=obtenerVideojuegosUsuario&email=${email}`);
  }

  crearVideojuego(formData: FormData): Observable<any> {
    return this._http.post<any>(`${this.url}?controller=videojuegos&action=crearVideojuego`, formData);
  }

}

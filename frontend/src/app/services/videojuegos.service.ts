import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego.interface';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  private url = 'http://localhost/gameCommunity/backend/src/app/videojuegos.php';

  private _http = inject(HttpClient);

  obtenerVideojuegos(): Observable<Videojuego[]> {
    return this._http.get<Videojuego[]>(`${this.url}?action=obtenerVideojuegos`);
  }

}

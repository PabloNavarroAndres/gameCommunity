import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VideojuegoUsuario } from '../models/videojuegoUsuario.interface';


@Injectable({
  providedIn: 'root'
})
export class VideojuegosUsuarioService {

  private url = 'http://localhost/gameCommunity/src/server/videojuegosUsuario.php';

  private _http = inject(HttpClient);

  obtenerVideojuegosUsuario():Observable<VideojuegoUsuario[]>{
    return this._http.get<VideojuegoUsuario[]>(`${this.url}?action=obtenerVideojuegosUsuario`);
  }

  agregarVideojuegoUsuario(videojuego: VideojuegoUsuario): Observable<VideojuegoUsuario> {
    return this._http.post<VideojuegoUsuario>(`${this.url}?action=agregarVideojuegoUsuario`, videojuego);
  }

}

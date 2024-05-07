import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VideojuegoUsuario } from '../models/videojuegoUsuario.interface';


@Injectable({
  providedIn: 'root'
})
export class VideojuegosUsuarioService {

  private url = 'http://localhost/gameCommunity/backend/src/app/videojuegosUsuario.php';

  private _http = inject(HttpClient);

  obtenerVideojuegosUsuario(email: string):Observable<VideojuegoUsuario[]>{
    return this._http.get<VideojuegoUsuario[]>(`${this.url}?action=obtenerVideojuegosUsuario&email=${email}`);
  }

  agregarVideojuegoUsuario(videojuego: VideojuegoUsuario):Observable<VideojuegoUsuario> {
    // Msj
    console.log('insertar: ');
    console.log(videojuego);

    return this._http.post<VideojuegoUsuario>(`${this.url}?action=agregarVideojuegoUsuario`, videojuego);
  }
  

}

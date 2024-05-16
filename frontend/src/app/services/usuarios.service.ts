import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private url = 'http://localhost/gameCommunity/backend/src/index.php';
  private _http = inject(HttpClient);

  // Usuario que ha iniciado sesión
  private usuarioIniciadoSubject: BehaviorSubject<User | null>;
  public usuarioIniciado: Observable<User | null>;

  constructor() {
    // Obtener el usuario iniciado como objeto del local storage
    this.usuarioIniciadoSubject = new BehaviorSubject<User | null>
      (JSON.parse(localStorage.getItem('usuarioIniciado') || '{}'));
    // Dejar como Observable el usuario del local storage
    this.usuarioIniciado = this.usuarioIniciadoSubject.asObservable();
  }

  // Obtener usuarios
  obtenerUsuarios(): Observable<User[]> {
    return this._http.get<User[]>(`${this.url}?controller=usuarios&action=obtenerUsuarios`);
  }

  // Obtener usuario por email
  obtenerUsuarioPorEmail(userEmail: string): Observable<User> {
    return this._http.get<User>(`${this.url}?controller=usuarios&action=obtenerUsuarioEmail&email=${userEmail}`);
  }

  // Insertar usuario
  agregarUsuario(usuario: User): Observable<User> {
    return this._http.post<User>(`${this.url}?controller=usuarios&action=agregarUsuario`, usuario);
  }

  // Obtener usuarios
  eliminarUsuario(): Observable<User[]> {
    return this._http.get<User[]>(`${this.url}?controller=usuarios&action=eliminarUsuario`);
  }

  // Actualizar usuario
  actualizarUsuario(usuario: User): Observable<User> {
    return this._http.put<User>(`${this.url}?controller=usuarios&action=actualizarUsuario`, usuario)
    .pipe(
      tap(() => {
        // Actualizar usuario iniciado en localStorage
        localStorage.setItem('usuarioIniciado', JSON.stringify(usuario));
      })
    );
  }

  // Sumar 1+ al contador de juegos deseados
  sumarJuegoDeseado(usuario: User): Observable<User> {
    return this._http.put<User>(`${this.url}?controller=usuarios&action=sumarDeseado`, usuario);
  }

  // Restar 1- al contador de juegos deseados
  restarJuegoDeseado(usuario: User): Observable<User> {
    return this._http.put<User>(`${this.url}?controller=usuarios&action=restarDeseado`, usuario);
  }

  // Sumar 1+ al contador de juegos terminados
  sumarJuegoTerminado(usuario: User): Observable<User> {
    return this._http.put<User>(`${this.url}?controller=usuarios&action=sumarTerminado`, usuario);
  }

  // Restar 1- al contador de juegos terminados
  restarJuegoTerminado(usuario: User): Observable<User> {
    return this._http.put<User>(`${this.url}?controller=usuarios&action=restarTerminado`, usuario);
  }


  // Obtener del local storage al usuario que ha iniciado sesión
  public obtenerUsuarioIniciado(): User | null {
    const usuarioIniciado = localStorage.getItem('usuarioIniciado');
    return usuarioIniciado ? JSON.parse(usuarioIniciado) : null;
  }

  // Agregar al local storage el usuario que ha iniciado sesión
  public agregarUsuarioIniciado(user: User): void {
    localStorage.setItem('usuarioIniciado', JSON.stringify(user));
    this.usuarioIniciadoSubject.next(user);
  }

  // Borrar al usuario del local storage
  public borrarUsuarioIniciado(): void {
    localStorage.removeItem('usuarioIniciado');
    this.usuarioIniciadoSubject.next(null);
  }

}

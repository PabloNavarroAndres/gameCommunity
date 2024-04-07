import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private url = 'http://localhost/gameCommunity/src/server/usuarios.php';
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

  // Obtener usuarios de la BD
  obtenerUsuarios(): Observable<User[]> {
    return this._http.get<User[]>(`${this.url}?action=obtenerUsuarios`);
  }

  // Insertar usuario a la BD
  agregarUsuario(usuario: User): Observable<User> {
    return this._http.post<User>(`${this.url}?action=agregarUsuario`, usuario);
  }

  // Obtener del local storage al usuario que ha iniciado sesión
  public obtenerUsuarioIniciado(): User | null {
    return this.usuarioIniciadoSubject.value;
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

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private url = 'http://localhost/gameCommunity/backend/src/index.php';

  private _http = inject(HttpClient);

  obtenerPosts(id: number):Observable<Post[]>{
    return this._http.get<Post[]>(`${this.url}?controller=post&action=obtenerPosts&community_id=${id}`);
  }

  crearPost(post: Post):Observable<Post> {
    return this._http.post<Post>(`${this.url}?controller=post&action=crearPost`, post);
  }

  /*

  Idea para la BD
  ---
  Para agregar un "Me gusta" a una publicación:

  UPDATE Posts
  SET liked_by = JSON_ARRAY_APPEND(liked_by, '$', 'correo@example.com')
  WHERE post_id = id_parametro;

  ---
  Para quitar un "Me gusta":

  UPDATE Posts
  SET liked_by = JSON_REMOVE(liked_by, JSON_UNQUOTE(JSON_SEARCH(liked_by, 'one', 'correo@example.com')))
  WHERE post_id = id_parametro;

  */
}

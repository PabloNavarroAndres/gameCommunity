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
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor() { }

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

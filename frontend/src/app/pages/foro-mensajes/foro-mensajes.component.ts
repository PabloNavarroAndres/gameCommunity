import { Component, inject } from '@angular/core';
import { NavegacionService } from '../../services/navegacion.service';
import { Post } from '../../models/post.interface';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-foro-mensajes',
  standalone: true,
  imports: [],
  templateUrl: './foro-mensajes.component.html',
  styleUrl: './foro-mensajes.component.css'
})
export class ForoMensajesComponent {

  // Servicio de navegacion
  private _navegacionService = inject(NavegacionService);

  // Servicio de posts
  private _postService = inject(PostsService);

  // Servicio ruta parametros
  private route = inject(ActivatedRoute);

  // Posts
  posts: Post[] = [];

  ngOnInit(): void {
    // Comprobamos si se han pasado parametros, de ver comunidad personalizada
    this.route.params.subscribe(params => {

      // Parametro de id de comunidad
      const idComunidad: number = +params['comunidadId'];

      if (idComunidad) {
        
        // Obtener comunidades de la BD
        this._postService.obtenerPosts(idComunidad)
          .subscribe({
            next: (posts: Post[]) => {
  
              // Establecemos las comunidades obtenidas
              this.posts = posts;
              console.log(this.posts);
            },
            error: (error: any) => {
              console.error('Error al obtener comunidades:', error);
            }
        });
      }

    });
  }

  // Volver hacia atras
  goBack(): void {
    this._navegacionService.goBack();
  }

}

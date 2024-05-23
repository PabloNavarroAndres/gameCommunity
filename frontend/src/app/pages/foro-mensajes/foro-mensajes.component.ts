import { Component, inject } from '@angular/core';
import { NavegacionService } from '../../services/navegacion.service';
import { Post } from '../../models/post.interface';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.interface';
import { UsuarioService } from '../../services/usuarios.service';
import { UsuariosComunidadService } from '../../services/usuarios-comunidad.service';
import { UsuarioComunidad } from '../../models/usuarioComunidad.interface';

@Component({
  selector: 'app-foro-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foro-mensajes.component.html',
  styleUrl: './foro-mensajes.component.css'
})
export class ForoMensajesComponent {

  // Servicio de navegacion
  private _navegacionService = inject(NavegacionService);

  // Servicio de posts
  private _postService = inject(PostsService);

  // Servicio de usuarios
  private _usuarioService = inject(UsuarioService);

  // Servicio de usuarios de comunidad
  private _usuariosComunidadService = inject(UsuariosComunidadService);

  // Servicio ruta parametros
  private route = inject(ActivatedRoute);

  // Usuario iniciado
  usuarioIniciado: User = this._usuarioService.obtenerUsuarioIniciado() as User;

  // Comunidad activa id
  idComunidad?: number;

  // Comprobar si es miembro de la comunidad
  esMiembro: boolean = false;

  // Posts
  posts: Post[] = [];

  mensaje: string = '';

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

              // Establecemos el id de la comunidad
              this.idComunidad = idComunidad;
            },
            error: (error: any) => {
              console.error('Error al obtener comunidades:', error);
            }
        });

        // Buscamos los usuarios de esa comunidad
        this._usuariosComunidadService.obtenerUsuariosComunidad(idComunidad)
        .subscribe({
          next: (usuarios: UsuarioComunidad[]) => {

            // Se busca si el usuario iniciado es parte de la comunidad
            const iniciadoMiembro = usuarios.find(usuario => usuario.user_email === this.usuarioIniciado.email);

            if (iniciadoMiembro) {
              this.esMiembro = true;
            }

          },
          error: (error: any) => {
            console.error('Error al obtener usuarios de comunidad:', error);
          }
        });

      }

    });
  }

  // Enviar mensaje al foro
  enviarMsj() {

    // Post a insertar en BD
    const post: Post = {
      content: this.mensaje,
      user_email: this.usuarioIniciado.email, 
      community_id: this.idComunidad as number,
      profile_picture: this.usuarioIniciado.profile_picture,
      username: this.usuarioIniciado.username
    };

    this._postService.crearPost(post)
    .subscribe({
      next: () => {

        // Añadimos al array de posts el post creado
        this.posts.push(post);
        this.mensaje = '';
      },
      error: (error: any) => {
        console.error('Error al crear post:', error);
      }
  });

  }

  // Volver hacia atras
  goBack(): void {
    this._navegacionService.goBack();
  }

}

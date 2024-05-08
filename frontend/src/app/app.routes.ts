import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { VideojuegosComponent } from './pages/videojuegos/videojuegos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ComunidadesComponent } from './pages/comunidades/comunidades.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'comunidades', component: ComunidadesComponent},
    { path: 'biblioteca', component: BibliotecaComponent},
    { path: 'videojuegos', component:  VideojuegosComponent},
    { path: 'perfil', component: PerfilComponent},
    /*
    { path: 'comunidad/personalizada/:comunidadId', component:  },
    { path: 'comunidad/personalizada/:comunidadId/foro', component:  },
    */
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
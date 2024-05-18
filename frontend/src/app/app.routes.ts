import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { VideojuegosComponent } from './pages/videojuegos/videojuegos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ComunidadesComponent } from './pages/comunidades/comunidades.component';
import { ComunidadGlobalComponent } from './pages/comunidad-global/comunidad-global.component';
import { ComunidadPersonalizadaComponent } from './pages/comunidad-personalizada/comunidad-personalizada.component';
import { ComunidadCrearComponent } from './pages/comunidad-crear/comunidad-crear.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'comunidades', component: ComunidadesComponent},
    { path: 'biblioteca', component: BibliotecaComponent},
    { path: 'videojuegos', component:  VideojuegosComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'perfil/:user_email', component: PerfilComponent},
    { path: 'comunidad/global', component: ComunidadGlobalComponent},
    { path: 'comunidad-crear', component: ComunidadCrearComponent},
    { path: 'comunidad/personalizadas', component: ComunidadPersonalizadaComponent },
    { path: 'comunidad/personalizada/:comunidadId', component: ComunidadPersonalizadaComponent },
    /*
    { path: 'comunidad/personalizada/:comunidadId/foro', component: ComunidadPersonalizadaComponent },
    */
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

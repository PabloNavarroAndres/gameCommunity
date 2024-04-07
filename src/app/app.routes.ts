import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { VideojuegosComponent } from './pages/videojuegos/videojuegos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'usuarios', component: UsuarioComponent},
    { path: 'biblioteca', component: BibliotecaComponent},
    { path: 'videojuegos', component:  VideojuegosComponent},
    { path: 'perfil', component: PerfilComponent},
    /*
    { path: 'comunidades', component:  },
    { path: 'comunidad/global', component:  },
    { path: 'comunidad/personalizadas', component:  },
    { path: 'comunidad/personalizadas/:comunidadId', component:  },
    { path: 'comunidad/personalizadas/:comunidadId/foro', component:  },
    */
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

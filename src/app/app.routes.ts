import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'usuarios', component: UsuarioComponent},
    /*
    { path: 'biblioteca', component:  },
    { path: 'perfil', component:  },
    { path: 'videojuegos', component:  },
    { path: 'comunidades', component:  },
    { path: 'comunidad/global', component:  },
    { path: 'comunidad/personalizadas', component:  },
    { path: 'comunidad/personalizadas/:comunidadId', component:  },
    { path: 'comunidad/personalizadas/:comunidadId/foro', component:  },
    */
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent},
    { path: 'registro', component: RegistroComponent},
    { path: 'usuarios', component: UsuarioComponent},
    /*
    { path: 'perfil', component:  },
    { path: 'biblioteca', component:  },
    { path: 'comunidades', component:  },
    { path: 'comunidad/global', component:  },
    { path: 'comunidad/personalizadas', component:  },
    { path: 'comunidad/personalizadas/:comunidadId', component:  },
    { path: 'comunidad/personalizadas/:comunidadId/foro', component:  },
    */
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

/*

home
login
registro
perfil
biblioteca
comunidades
comunidad/global
comunidad/personalizadas
comunidad/personalizadas/:id
comunidad/personalizadas/:id/foro

*/
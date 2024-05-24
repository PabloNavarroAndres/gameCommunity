import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { VideojuegosComponent } from './pages/videojuegos/videojuegos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ComunidadesComponent } from './pages/comunidades/comunidades.component';
import { ComunidadGlobalComponent } from './pages/comunidad-global/comunidad-global.component';
import { ComunidadPersonalizadaComponent } from './pages/comunidad-personalizada/comunidad-personalizada.component';
import { ComunidadCrearComponent } from './pages/comunidad-crear/comunidad-crear.component';
import { ForoMensajesComponent } from './pages/foro-mensajes/foro-mensajes.component';
import { PanelAdministradorComponent } from './pages/panel-administrador/panel-administrador.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'comunidades', component: ComunidadesComponent},
    { path: 'biblioteca', component: BibliotecaComponent},
    { path: 'videojuegos', component:  VideojuegosComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'perfil/:user_email', component: PerfilComponent},
    { path: 'comunidades/global', component: ComunidadGlobalComponent},
    { path: 'comunidades/crear', component: ComunidadCrearComponent},
    { path: 'comunidades/editar/:comunidadId', component: ComunidadCrearComponent},
    { path: 'comunidades/personalizadas', component: ComunidadPersonalizadaComponent },
    { path: 'comunidades/personalizada/:comunidadId', component: ComunidadPersonalizadaComponent },
    { path: 'comunidades/personalizada/:comunidadId/foro', component: ForoMensajesComponent },
    { path: 'administrador', component:  PanelAdministradorComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

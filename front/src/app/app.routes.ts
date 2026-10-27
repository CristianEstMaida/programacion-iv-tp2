import { Routes } from '@angular/router';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Carga normal o perezosa (Lazy Loading) de tus componentes
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.Login) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./components/register/register').then(m => m.Register) 
  },
  { 
    path: 'publicaciones', 
    loadComponent: () => import('./components/publicaciones/publicaciones.component').then(m => m.PublicacionesComponent) 
  },
  { 
    path: 'perfil', 
    loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(m => MiPerfilComponent) 
  },

  { path: '**', redirectTo: 'login' }
];
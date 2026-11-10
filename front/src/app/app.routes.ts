import { Routes } from '@angular/router';
import { AdminGuard } from './components/guards/admin.guard';

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
    loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent) 
  },
  {
    path: 'dashboard/usuarios',
    loadComponent: () => import('./components/dashboard-usuarios/dashboard-usuarios.component').then(m => m.DashboardUsuariosComponent),
    canActivate: [AdminGuard] // Solo los administradores pueden entrar aquí
  },
  {
    path: 'dashboard/estadisticas',
    loadComponent: () => import('./components/dashboard-estadisticas/dashboard-estidisticas.component').then(m => m.DashboardEstadisticasComponent),
    canActivate: [AdminGuard] // Solo los administradores pueden entrar aquí
  },


  { path: '**', redirectTo: 'login' }
];
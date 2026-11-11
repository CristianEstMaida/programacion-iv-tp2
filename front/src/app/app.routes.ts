import { Routes } from '@angular/router';
import { AdminGuard } from './components/guards/admin.guard';
import { AuthGuard } from './components/guards/auth.guard';

export const routes: Routes = [
  // Al iniciar, arranca en loading (que hace la validación inicial que pide la consigna)
  { path: '', redirectTo: 'loading', pathMatch: 'full' },
  
  // Carga normal o perezosa (Lazy Loading) de tus componentes
  // Rutas totalmente libres (acceso inicial / público)
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.Login) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./components/register/register').then(m => m.Register) 
  },
   { 
    path: 'loading', 
    loadComponent: () => import('./components/loading-page/loading-page.component').then(m => m.LoadingPageComponent) 
    // Sin guard, porque es la pantalla que valida el token al arrancar
  },
  // Rutas protegidas por la consigna (exigen sesión activa)
  { 
    path: 'publicaciones', 
    loadComponent: () => import('./components/publicaciones/publicaciones.component').then(m => m.PublicacionesComponent),
    canActivate: [AuthGuard] // Solo los usuarios logueados pueden acceder a publicaciones
  },
  { 
  path: 'publicaciones/:id', 
    loadComponent: () => import('./components/publicacion-detalle/publicacion-detalle.component').then(m => m.PublicacionDetalleComponent),
    canActivate: [AuthGuard] // Solo los usuarios logueados pueden acceder al detalle de publicaciones
  },
  { 
    path: 'perfil', 
    loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent),
    canActivate: [AuthGuard] // Solo los usuarios logueados pueden acceder a su perfil
  },

  // Rutas de administración
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
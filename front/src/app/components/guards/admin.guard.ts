import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const AdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificamos si el usuario está logueado y si su rol es admin
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol'); // O la forma en que guardes el rol en el cliente

  if (token && (rol === 'admin' || rol === 'administrador')) {
    return true; // Puede pasar
  }

  // Si no es admin, lo redirigimos al inicio o login
  router.navigate(['/']);
  return false;
};
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const AdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificamos si el usuario está logueado y si su rol es admin
  const token = localStorage.getItem('token');
  const rolGuardado = localStorage.getItem('rol');
  
  // Limpiamos el rol: pasamos a minúsculas y sacamos espacios por si acaso
  const rol = rolGuardado ? rolGuardado.trim().toLowerCase() : '';

  console.log('Guard - Token:', !!token);
  console.log('Guard - Rol:', rol);

  if (token && (rol === 'admin' || rol === 'administrador')) {
    return true; // Puede pasar
  }

  // Si no es admin, lo redirigimos al inicio o login
  router.navigate(['/']);
  return false;
};
// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
// Asumiendo que tenés un servicio de autenticación que valida si hay sesión
import { Auth} from '../../services/auth.service'; 

export const AuthGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Déjalo pasar
  } else {
    // Si no está logueado o expiró, lo mandamos al login
    router.navigate(['/login']);
    return false;
  }
};
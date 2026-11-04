import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // 1. Si hay token, lo clonamos y lo inyectamos en los headers automáticamente
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Manejamos la petición y atrapamos errores globales como el 401
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token vencido o rechazo del backend: limpiamos y mandamos al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiration');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
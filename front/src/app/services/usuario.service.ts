import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://programacion-iv-tp2-back.vercel.app/api/usuarios';

  constructor(private http: HttpClient) {}

  // Actualizar perfil por ID (aprovechando el interceptor global para el token)
  actualizarPerfil(id: string, datos: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, datos);
  }
}
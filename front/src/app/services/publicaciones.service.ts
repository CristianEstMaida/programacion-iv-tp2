import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // O tu ruta de environment

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private apiUrl = `${environment.apiUrl}/publicaciones`;

  constructor(private http: HttpClient) {}

  obtenerPublicaciones(params?: { 
    usuarioId?: string; 
    orden?: 'fecha' | 'likes'; 
    limit?: number; 
    offset?: number 
  }): Observable<any> {
    let queryParams = '';
    if (params) {
      const queryParts: string[] = [];
      if (params.usuarioId) queryParts.push(`usuarioId=${params.usuarioId}`);
      if (params.orden) queryParts.push(`orden=${params.orden}`);
      if (params.limit !== undefined) queryParts.push(`limit=${params.limit}`);
      if (params.offset !== undefined) queryParts.push(`offset=${params.offset}`);
      
      if (queryParts.length > 0) {
        queryParams = `?${queryParts.join('&')}`;
      }
    }

    // El interceptor global le inyecta el token solo
    return this.http.get(`${this.apiUrl}${queryParams}`);
  }

  crearPublicacion(data: FormData): Observable<any> {
    // Al mandar el FormData directamente y sin headers manuales, 
    // el interceptor añade el token y el navegador calcula el archivo perfecto.
    return this.http.post(this.apiUrl, data);
  }

  darMegusta(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  quitarMegusta(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/like`);
  }

  eliminarPublicacion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // --- ENDPOINTS DE COMENTARIOS ---

  // 1. Obtener comentarios con paginación (GET)
  obtenerComentarios(publicacionId: string, page: number = 1, limit: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${publicacionId}/comentarios?page=${page}&limit=${limit}`);
  }

  // 2. Crear un nuevo comentario (POST)
  crearComentario(publicacionId: string, data: { mensaje: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${publicacionId}/comentarios`, data);
  }

  // 3. Editar un comentario existente (PUT)
  editarComentario(comentarioId: string, data: { mensaje: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/comentarios/${comentarioId}`, data);
  }
}
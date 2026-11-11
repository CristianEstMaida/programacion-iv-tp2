import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  // Obtener una publicación específica por su ID (Para la pantalla de detalle)
  obtenerPublicacionPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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

  // Obtener comentarios de una publicación con paginación (limit y offset)
  obtenerComentarios(publicacionId: string, page: number, limit: number): Observable<any> {
    const offset = (page - 1) * limit;
    const params = new HttpParams()
      .set('publicacion', publicacionId)
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<any>(`${this.apiUrl}/${publicacionId}/comentarios`, { params });
  }

  // 1. Obtener comentarios con paginación (GET)
  // obtenerComentarios(publicacionId: string, page: number = 1, limit: number = 5): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${publicacionId}/comentarios?page=${page}&limit=${limit}`);
  // }

  // 2. Crear un nuevo comentario (POST)
  // crearComentario(publicacionId: string, data: { mensaje: string }): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/${publicacionId}/comentarios`, data);
  // }
  crearComentario(publicacionId: string, data: { mensaje: string }): Observable<any> {
    const body = {
      ...data,
      publicacion: publicacionId
    };
    return this.http.post<any>(`${this.apiUrl}/${publicacionId}/comentarios`, body);
  }

  // 3. Editar un comentario existente (PUT)
  editarComentario(comentarioId: string, data: { mensaje: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/comentarios/${comentarioId}`, data);
  }


}
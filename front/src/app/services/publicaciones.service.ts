import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // O tu ruta de environment

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private API_URL = `${environment.apiUrl}/publicaciones`;

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
    return this.http.get(`${this.API_URL}${queryParams}`);
  }

  crearPublicacion(data: FormData): Observable<any> {
    // Al mandar el FormData directamente y sin headers manuales, 
    // el interceptor añade el token y el navegador calcula el archivo perfecto.
    return this.http.post(this.API_URL, data);
  }

  darMegusta(id: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/like`, {});
  }

  quitarMegusta(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/like`);
  }

  eliminarPublicacion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
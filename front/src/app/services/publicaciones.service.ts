import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private API_URL = 'http://localhost:3000/api/publicaciones'; // Ajusta tu URL base

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token'); // O la clave con la que guardes tu JWT en el login
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  obtenerPublicaciones(params?: { 
    usuarioId?: string; 
    orden?: 'fecha' | 'likes'; 
    limit?: number; 
    offset?: number 
  }): Observable<any> {
    
    // Construimos los parámetros HTTP dinámicamente si los envías
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

    // Realiza la petición GET enviando la URL con los parámetros y el token JWT
    return this.http.get(`${this.API_URL}${queryParams}`, this.getAuthHeaders());
  }

  crearPublicacion(data: any): Observable<any> {
    return this.http.post(this.API_URL, data, this.getAuthHeaders()); // 👈 ¡No olvides pasar los headers aquí!
  }

  darMegusta(id: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/like`, {}, this.getAuthHeaders());
  }

  quitarMegusta(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/like`, this.getAuthHeaders());
  }

  eliminarPublicacion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, this.getAuthHeaders());
  }
}
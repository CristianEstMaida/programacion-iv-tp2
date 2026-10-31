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
    const token = localStorage.getItem('token'); // O donde guardes tu JWT
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  obtenerPublicaciones(): Observable<any> {
    return this.http.get(this.API_URL, this.getAuthHeaders());
  }

  crearPublicacion(data: any): Observable<any> {
    return this.http.post(this.API_URL, data, this.getAuthHeaders());
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
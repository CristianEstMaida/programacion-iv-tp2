import { inject, Service } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Service()
export class Auth {

  // private apiUrl = 'http://localhost:3000/autenticacion';
  private apiUrl = `${environment.apiUrl}/autenticacion`;

  private http = inject(HttpClient);

  login(credentials: { identificador: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, userData);
  }

  refreshToken() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Asumiendo que tu ruta de refrescar por POST es algo como /auth/refrescar o /refresh
    return this.http.post(`${this.apiUrl}/refrescar`, {}, { headers });
  }
}

import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { environment } from '../../environments/environment';
=======
>>>>>>> 6750fee216b559d2cfb4f73672613fb9be8925f6

@Service()
export class Auth {

<<<<<<< HEAD
  // private apiUrl = 'http://localhost:3000/autenticacion';
  private apiUrl = `${environment.apiUrl}/autenticacion`;
=======
  private apiUrl = 'http://localhost:3000/autenticacion';
>>>>>>> 6750fee216b559d2cfb4f73672613fb9be8925f6

  private http = inject(HttpClient);

  login(credentials: { identificador: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, userData);
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Auth } from '../app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  imports: [CommonModule, RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy{
  protected readonly title = signal('red-social-front');
  mostrarNavbar = true;
  private expirationTimer: any;
  public mostrarModalExpiracion = false;
  public cargando = true; 
  private apiUrl = 'http://localhost:3000/api';

  constructor(private router: Router, private cdr: ChangeDetectorRef, private authService: Auth, private http: HttpClient) {
    // 1. Verificamos la ruta actual apenas carga la aplicación
    this.verificarRuta(this.router.url);

    // 2. Escuchamos los cambios cuando el usuario navegue entre pantallas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).forEach((event: any) => {
      this.verificarRuta(event.urlAfterRedirects);
      this.iniciarMonitoreoToken();
    });
  }

  ngOnInit() {
    this.verificarTokenInicial();
  }

  verificarTokenInicial() {
    const token = localStorage.getItem('access_token');
    
    // 1. Definimos un tiempo mínimo de visualización (ej: 1.5 segundos / 1500ms)
    const tiempoMinimoCarga = new Promise(resolve => setTimeout(resolve, 1500));

    // Si ni siquiera hay token guardado, apagamos el cargando y mandamos al login
    if (!token) {
      tiempoMinimoCarga.then(() => {
        this.cargando = false;
        this.cdr.detectChanges();
        if (!this.router.url.includes('/login') && !this.router.url.includes('/registro')) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    // Si hay token, consultamos la ruta /autorizar del backend (con el header correspondiente)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // 2. Ejecutamos la petición al backend y el tiempo mínimo en paralelo con Promise.all
    const peticionBackend = this.http.post(`${this.apiUrl}/autenticacion/autorizar`, {}, { headers });

    Promise.all([tiempoMinimoCarga, peticionBackend.toPromise()]).then(
      ([_, res]: [any, any]) => {
        // Token válido: pasaron los 1500ms y el backend respondió OK
        this.cargando = false;
        this.cdr.detectChanges();
        this.iniciarMonitoreoToken();
      }
    ).catch((err) => {
      // Token inválido o error de red: pasaron los 1500ms y falló
      console.error("Error al autorizar token:", err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expiration');
      this.cargando = false;
      this.cdr.detectChanges();
      this.router.navigate(['/login']);
    });
  }

  iniciarMonitoreoToken() {
    // Si estamos en login o registro, no monitoreamos nada
    if (this.router.url.includes('/login') || this.router.url.includes('/registro')) {
      if (this.expirationTimer) clearTimeout(this.expirationTimer);
      return;
    }

    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return;

    const tiempoRestante = Number(expiration) - Date.now();
    
    // Queremos que el aviso salte 5 segundos antes de que expire el token
    const tiempoParaAviso = tiempoRestante - 5000; 

    if (tiempoParaAviso > 0) {
      if (this.expirationTimer) clearTimeout(this.expirationTimer);

      // Programa el temporizador exacto
      this.expirationTimer = setTimeout(() => {
        this.mostrarModalExpiracion = true;

        // 2. FORZAS la actualización de la vista aquí mismo
        this.cdr.detectChanges();
      }, tiempoParaAviso);
    } else {
      // Si ya pasó el tiempo, lo muestra de inmediato
      this.mostrarModalExpiracion = true;
      this.cdr.detectChanges();
    }
  }

  extendSession() {
    // Aquí puedes llamar a un endpoint de refresh token en tu backend
   
    this.authService.refreshToken().subscribe({
      next: (res: any) => {
        // El backend devuelve el nuevo token
        const nuevoToken = res.access_token; // O res.token (según cómo lo devuelva tu API)
        localStorage.setItem('access_token', nuevoToken);

        // Extraemos la nueva expiración del payload del token renovado
        const tokenData = JSON.parse(atob(nuevoToken.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; 
        localStorage.setItem('token_expiration', expirationTime.toString());

        // Ocultamos el modal y reiniciamos el temporizador
        this.mostrarModalExpiracion = false;
        this.cdr.detectChanges();
        this.iniciarMonitoreoToken();
      },
      error: (err: any) => {
        console.error('Error al refrescar el token:', err);
        // Si el token ya expiró por completo en el backend, cerramos sesión
        this.cerrarSesionPorExpiracion();
      }
    });

  }

  cerrarSesionPorExpiracion() {
    if (this.expirationTimer) clearTimeout(this.expirationTimer);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration');
    this.mostrarModalExpiracion = false;
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.expirationTimer) clearTimeout(this.expirationTimer);
  }

  private verificarRuta(url: string) {
    // Oculta el navbar únicamente si estamos en login o registro
    this.mostrarNavbar = !url.includes('/login') && !url.includes('/registro');
  }

  logout() {
    // 1. Limpiar los timers activos si los hubiera
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }

    // 2. Borrar las credenciales y datos del localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration');
    // Si guardaste datos del usuario (como nombre o rol), bórralos también:
    // localStorage.removeItem('user_data');

    // 3. Ocultar cualquier modal que haya quedado abierto
    this.mostrarModalExpiracion = false;

    // 4. Redirigir al login
    this.router.navigate(['/login']);
  }
}

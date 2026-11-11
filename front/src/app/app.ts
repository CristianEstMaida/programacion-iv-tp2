import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
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
  private finalLogoutTimer: any;
  public mostrarModalExpiracion = false;
  public cargando = true; 
  mostrarModalInactividad = false;
  esAdmin = false;
  // private apiUrl = 'https://programacion-iv-tp2-back.vercel.app/api';

  constructor(private router: Router, private cdr: ChangeDetectorRef, private authService: Auth, private http: HttpClient) {
    // 1. Verificamos la ruta actual apenas carga la aplicación
    this.verificarRuta(this.router.url);

    // 2. Escuchamos los cambios cuando el usuario navegue entre pantallas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).forEach((event: any) => {
      this.verificarRuta(event.urlAfterRedirects);

    });
  }

  ngOnInit() {
    this.verificarRolAdmin();
    this.verificarTokenInicial();
  }

  verificarRolAdmin() {
    // Leemos el rol que guardamos en el localStorage al hacer login
    const rol = localStorage.getItem('rol');
    
    // Comprobamos si coincide con admin o administrador
    if (rol === 'admin' || rol === 'administrador') {
      this.esAdmin = true;
    } else {
      this.esAdmin = false;
    }
  }

  async verificarTokenInicial() {
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
    
    // 2. Ejecutamos la petición al backend y el tiempo mínimo en paralelo con Promise.all// En lugar de llamar a `this.http.post` a mano, usas el servicio:
    const peticionBackend = this.authService.autorizarToken(token);
    //const peticionBackend = this.http.post(`${this.apiUrl}/autenticacion/autorizar`, {}, { headers });

    try {
      await Promise.all([tiempoMinimoCarga, firstValueFrom(peticionBackend)]);
      // Token válido
      this.cargando = false;
      this.cdr.detectChanges();
      this.iniciarMonitoreoToken();
    } catch (err) {
      console.error("Error al autorizar token:", err);
      this.cerrarSesionPorExpiracion();
    }

  }

  iniciarMonitoreoToken() {
    // Si estamos en login o registro, no monitoreamos nada
    if (this.router.url.includes('/login') || this.router.url.includes('/registro')) {
      this.limpiarTimers();
      return;
    }

    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) {
      console.warn("⚠️ No hay 'token_expiration' en el localStorage");
      return;
    }

    const tiempoRestante = Number(expiration) - Date.now();
    console.log(`⏱️ Tiempo restante calculado para el token: ${tiempoRestante} ms`);

    this.limpiarTimers();

    if (tiempoRestante <= 0) {
      // Si el token ya venció por completo, chau sesión
      console.warn("❌ El token ya expiró según el localStorage.");
      this.cerrarSesionPorExpiracion();
      return;
    }

    // Queremos que el aviso salte 5 segundos antes de que expire el token
    const tiempoParaAviso = Math.floor(tiempoRestante / 2);
    const tiempoRestanteParaLogout = tiempoRestante - tiempoParaAviso;

    // Programa el temporizador exacto
    this.expirationTimer = setTimeout(() => {
      console.log("📢 ¡Disparando modal de expiración!");
      this.mostrarModalExpiracion = true;

      // 2. FORZAS la actualización de la vista aquí mismo
      this.cdr.detectChanges();

      // Si el usuario ignora o cancela el modal, corren los últimos 5 minutos hasta expirar por completo
      this.finalLogoutTimer = setTimeout(() => {
        console.log("🚪 Tiempo agotado tras el modal. Cerrando sesión...");
        this.cerrarSesionPorExpiracion();
      }, tiempoRestanteParaLogout);
    }, tiempoParaAviso);
  
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

  // Si el usuario presiona "Cancelar" en el modal
  cancelarExtension() {
    this.mostrarModalExpiracion = false;
    this.cdr.detectChanges();
    // El temporizador de los 5 minutos restantes ya está corriendo en segundo plano gracias a `this.logoutSub`. 
    // Cuando termine, se ejecutará `cerrarSesionPorExpiracion()`.
  }

  cerrarSesionPorExpiracion() {
    this.limpiarTimers();
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('rol');
    this.mostrarModalExpiracion = false;
    this.cargando = false;
    this.cdr.detectChanges();
    // Omitimos el router.navigate aquí para dejar que el Interceptor HTTP 
    // sea el que detecte el 401 del backend y redirija de forma oficial.
    //this.router.navigate(['/login']);
  }

  private limpiarTimers() {
    if (this.expirationTimer) clearTimeout(this.expirationTimer); // Corregido el typo por seguridad
    if (this.finalLogoutTimer) clearTimeout(this.finalLogoutTimer);
  }

  ngOnDestroy() {
    this.limpiarTimers();
  }

  private verificarRuta(url: string) {
    // Oculta el navbar únicamente si estamos en login o registro
    this.mostrarNavbar = !url.includes('/login') && !url.includes('/registro');
  }

  logout() {
    this.cerrarSesionPorExpiracion();
    this.router.navigate(['/login']);
  }
}

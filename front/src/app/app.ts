import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
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
    this.iniciarMonitoreoToken();
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
    // Aquí puedes llamar a un endpoint de refresh token en tu backend, 
    // o simular renovando la fecha en el localStorage si tu práctico es más simple:
    const nuevoTiempo = Date.now() + 20000; // Extiende 20 segundos más para la prueba
    localStorage.setItem('token_expiration', nuevoTiempo.toString());
    this.mostrarModalExpiracion = false;

    this.cdr.detectChanges();
    this.iniciarMonitoreoToken();
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

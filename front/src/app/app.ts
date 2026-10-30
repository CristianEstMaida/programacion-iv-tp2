import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  imports: [CommonModule, RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('red-social-front');
  mostrarNavbar = true;

  constructor(private router: Router) {
    // 1. Verificamos la ruta actual apenas carga la aplicación
    this.verificarRuta(this.router.url);

    // 2. Escuchamos los cambios cuando el usuario navegue entre pantallas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).forEach((event: any) => {
      this.verificarRuta(event.url);
    });
  }

  private verificarRuta(url: string) {
    // Oculta el navbar únicamente si estamos en login o registro
    this.mostrarNavbar = !url.includes('/login') && !url.includes('/registro');
  }
}

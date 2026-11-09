import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FiltroActivosPipe } from '../../pipes/filtro-activos.pipe';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { RolStyleDirective } from '../../directives/rol-style.directive';
import { HoverDirective } from '../../directives/hover.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [
    CommonModule, 
    FiltroActivosPipe, 
    CapitalizePipe, 
    RolStyleDirective,
    HoverDirective,
    FadeInDirective
  ],
  templateUrl: './dashboard-usuarios.component.html',
  styleUrls: ['./dashboard-usuarios.component.css']
})
export class DashboardUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  private apiUrl = 'https://programacion-iv-tp2-back.vercel.app/api/usuarios'; // Ajusta tu URL del back

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios guardados en la variable:', this.usuarios); // 👈 Mira esto en la consola del navegador (F12)
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  // Baja lógica (DELETE /usuarios/:id)
  darDeBaja(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.cargarUsuarios(), // Recarga la lista
      error: (err) => console.error('Error al dar de baja:', err)
    });
  }

  // Alta lógica (PATCH /usuarios/:id/activar)
  activarUsuario(id: string) {
    this.http.patch(`${this.apiUrl}/${id}/activar`, {}).subscribe({
      next: () => this.cargarUsuarios(), // Recarga la lista
      error: (err) => console.error('Error al activar usuario:', err)
    });
  }
}
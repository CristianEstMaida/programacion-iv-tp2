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

  mostrarFormulario: boolean = false;

  // Objeto para capturar los datos del formulario (mismos campos que el registro)
  nuevoUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    perfil: 'usuario' // Valor por defecto para los radio buttons
  };

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

  crearUsuario() {
    // Aseguramos que el username tome el email si no se llena aparte
    this.nuevoUsuario.username = this.nuevoUsuario.email;

    // Ajusta la URL según tu endpoint de registro o creación de usuarios del backend
    const urlRegistro = 'https://programacion-iv-tp2-back.vercel.app/api/autenticacion/registro'; 
    // o 'https://programacion-iv-tp2-back.vercel.app/api/usuarios' si creas usuarios directo como admin

    this.http.post(urlRegistro, this.nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario creado con éxito', res);
        this.mostrarFormulario = false;
        this.cargarUsuarios(); // Recargamos la tabla para ver el nuevo registro
        // Limpiar formulario
        this.nuevoUsuario = { nombre: '', apellido: '', email: '', username: '', password: '', perfil: 'usuario' };
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        alert('No se pudo crear el usuario. Revisa los datos.');
      }
    });
  }
}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FiltroActivosPipe } from '../../pipes/filtro-activos.pipe';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { RolStyleDirective } from '../../directives/rol-style.directive';
import { HoverDirective } from '../../directives/hover.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [
    CommonModule, 
    FiltroActivosPipe, 
    CapitalizePipe, 
    RolStyleDirective,
    HoverDirective,
    FadeInDirective,
    FormsModule
  ],
  templateUrl: './dashboard-usuarios.component.html',
  styleUrls: ['./dashboard-usuarios.component.css']
})
export class DashboardUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  private apiUrl = 'https://programacion-iv-tp2-back.vercel.app/api/usuarios'; // Ajusta tu URL del back

  mostrarFormulario: boolean = false;

  erroresFormulario: string[] = [];

  // Objeto para capturar los datos del formulario (mismos campos que el registro)
  nuevoUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    repetirPassword: '',
    fechaNacimiento: '',   // Obligatorio
    descripcion: '',       // Opcional o requerido según tu backend
    imagenPerfil: '',      // Opcional o string por defecto
    perfil: 'usuario',
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
    this.erroresFormulario = [];

    // Validación en frontend para evitar viajes inútiles al backend si falta algo clave
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.apellido || !this.nuevoUsuario.email || !this.nuevoUsuario.fechaNacimiento) {
      this.erroresFormulario = ['Por favor complete los campos obligatorios principales, incluyendo la fecha de nacimiento.'];
      return;
    }

    // Validamos que las contraseñas coincidan antes de enviar
    if (this.nuevoUsuario.password !== this.nuevoUsuario.repetirPassword) {
      this.erroresFormulario = ['Las contraseñas no coinciden.'];
      return;
    }

    // Aseguramos que el username tome el email si no se llena aparte
    if (!this.nuevoUsuario.username) {
      this.nuevoUsuario.username = this.nuevoUsuario.email;
    }

    // Ajusta la URL según tu endpoint de registro o creación de usuarios del backend
    const urlRegistro = 'https://programacion-iv-tp2-back.vercel.app/api/autenticacion/registro'; 
    // o 'https://programacion-iv-tp2-back.vercel.app/api/usuarios' si creas usuarios directo como admin

    this.http.post(urlRegistro, this.nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario creado con éxito', res);
        this.mostrarFormulario = false;
        this.erroresFormulario = [];
        this.cargarUsuarios(); // Recargamos la tabla para ver el nuevo registro
        // Limpiar formulario
        this.nuevoUsuario = {
          nombre: '',
          apellido: '',
          email: '',
          username: '',
          password: '',
          repetirPassword: '',
          fechaNacimiento: '',
          descripcion: '',
          imagenPerfil: '',
          perfil: 'usuario'
        };
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        const erroresBackend = err.error?.message;
        
        if (Array.isArray(erroresBackend)) {
          this.erroresFormulario = erroresBackend; // Guardamos los errores para mostrarlos en el HTML
        } else if (typeof erroresBackend === 'string') {
          this.erroresFormulario = [erroresBackend];
        } else {
          this.erroresFormulario = ['No se pudo crear el usuario. Revisa los datos ingresados.'];
        }
      }
    });
  }
}
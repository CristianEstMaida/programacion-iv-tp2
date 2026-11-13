import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { RolStyleDirective } from '../../directives/rol-style.directive';
import { HoverDirective } from '../../directives/hover.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [
    CommonModule, 
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

  // 1. Declarar esta variable para almacenar el archivo seleccionado
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`).subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios guardados en la variable:', this.usuarios); // 👈 Mira esto en la consola del navegador (F12)
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  // 2. Método para capturar el archivo cuando el admin lo selecciona
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Archivo seleccionado para el nuevo usuario:", file.name);
    }
  }

  // Baja lógica (DELETE /usuarios/:id)
  darDeBaja(id: string) {
    this.http.delete(`${environment.apiUrl}/usuarios/${id}`).subscribe({
      next: () => this.cargarUsuarios(), // Recarga la lista
      error: (err) => console.error('Error al dar de baja:', err)
    });
  }

  // Alta lógica (PATCH /usuarios/:id/activar)
  activarUsuario(id: string) {
    this.http.patch(`${environment.apiUrl}/usuarios/${id}/activar`, {}).subscribe({
      next: () => this.cargarUsuarios(), // Recarga la lista
      error: (err) => console.error('Error al activar usuario:', err)
    });
  }

  crearUsuario() {
    this.erroresFormulario = [];

    // Validación en frontend para evitar viajes inútiles si falta algo clave
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

    // Creamos el FormData para empaquetar textos y el archivo juntos
    const formData = new FormData();
    formData.append('nombre', this.nuevoUsuario.nombre || '');
    formData.append('apellido', this.nuevoUsuario.apellido || '');
    formData.append('email', this.nuevoUsuario.email || '');
    formData.append('username', this.nuevoUsuario.username || '');
    formData.append('password', this.nuevoUsuario.password || '');
    formData.append('repetirPassword', this.nuevoUsuario.repetirPassword || '');
    formData.append('fechaNacimiento', this.nuevoUsuario.fechaNacimiento || '');
    formData.append('descripcion', this.nuevoUsuario.descripcion || '');
    formData.append('perfil', this.nuevoUsuario.perfil || 'usuario');

    // Si se seleccionó un archivo de imagen, lo adjuntamos
    if (this.selectedFile) {
      formData.append('imagenPerfil', this.selectedFile);
    }

    // Usamos tu variable de entorno en lugar de la URL quemada
    const urlRegistro = `${environment.apiUrl}/autenticacion/registro`; 

    this.http.post(urlRegistro, formData).subscribe({
      next: (res) => {
        console.log('Usuario creado con éxito', res);
        this.mostrarFormulario = false;
        this.erroresFormulario = [];
        this.selectedFile = null; // Limpiamos el archivo temporal
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
          this.erroresFormulario = erroresBackend;
        } else if (typeof erroresBackend === 'string') {
          this.erroresFormulario = [erroresBackend];
        } else {
          this.erroresFormulario = ['No se pudo crear el usuario. Revisa los datos ingresados.'];
        }
      }
    });
  }
}
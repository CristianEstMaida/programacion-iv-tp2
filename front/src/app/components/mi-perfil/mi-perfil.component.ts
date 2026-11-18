import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../services/usuario.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: any = {};
  ultimasPublicaciones: any[] = [];
  cargando: boolean = true;
  mensajeExito: string = '';
  mensajeError: string = '';
  imagenRota: boolean = false;
  // 1. Declarar esta propiedad en tu clase
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private usuarioService: UsuarioService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  getFechaHoy(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  getSafeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // 2. Método que se ejecuta cuando seleccionas una imagen
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Archivo seleccionado con éxito:", file.name);
    }
  }

  cargarPerfil() {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const usuarioId = payload.sub || payload.id;

    const emailToken = payload.identificador || '';
    this.usuario = {
      _id: usuarioId,
      nombre: emailToken.split('@')[0],
      apellido: '',
      username: emailToken,
      correo: emailToken,
      descripcion: 'Cargando perfil...',
      fechaNacimiento: ''
    };

    // 1. Petición al backend para traer el perfil real de la BD
    this.http.get(`${environment.apiUrl}/usuarios/${usuarioId}`).subscribe({
      next: (response: any) => {
        console.log("Datos reales del usuario desde la BD:", response);
        const userData = response.data || response;

        if (userData.imagenPerfil && userData.imagenPerfil.startsWith('/uploads/http')) {
          userData.imagenPerfil = userData.imagenPerfil.replace('/uploads/', '');
        }

        // Sobrescribimos con los datos reales de la base de datos
        this.usuario = {
          ...this.usuario,
          ...userData,
          username: userData.username || userData.nombreUsuario || emailToken,
          correo: userData.email || userData.correo || emailToken,
          descripcion: userData.descripcion || '',
          fechaNacimiento: userData.fechaNacimiento ? userData.fechaNacimiento.substring(0, 10) : ''
        };

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el usuario del backend:', err);
      }
    });

    // 2. Traer las últimas 3 publicaciones
    this.http.get<any[]>(`${environment.apiUrl}/publicaciones?usuarioId=${usuarioId}&limit=3&offset=0&orden=fecha`).subscribe({
      next: (pubs) => {
        console.log("Publicaciones recibidas:", pubs);
        this.ultimasPublicaciones = pubs;
        this.cargando = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarPerfil() {
    if (!this.usuario || !this.usuario._id) return;

    // Validación: La fecha de nacimiento no puede ser posterior a hoy
    if (this.usuario.fechaNacimiento) {
      const fechaNacimiento = new Date(this.usuario.fechaNacimiento);
      const hoy = new Date();
      // Limpiamos la hora para comparar solo fechas puras (año, mes, día)
      hoy.setHours(0, 0, 0, 0);

      if (fechaNacimiento > hoy) {
        this.mensajeError = 'La fecha de nacimiento no puede ser posterior a la actual.';
        this.mensajeExito = '';
        this.cdr.detectChanges();
        return; // Frena la ejecución y no envía nada al backend
      }
    }
      

    // Creo el FormData para empaquetar textos y archivos juntos
    const formData = new FormData();
    formData.append('nombre', this.usuario.nombre || '');
    formData.append('apellido', this.usuario.apellido || '');
    formData.append('descripcion', this.usuario.descripcion || '');
    formData.append('fechaNacimiento', this.usuario.fechaNacimiento || '');
    
    // Si eligió una foto nueva, la adjunto con la clave 'imagenPerfil'
    if (this.selectedFile) {
      formData.append('imagenPerfil', this.selectedFile);
    }

    // Llamo a mi servicio pasándole el formData
    this.usuarioService.actualizarPerfil(this.usuario._id, formData).subscribe({
      next: (res: any) => {
        console.log('¡Backend respondió OK!', res);
        this.mensajeExito = '¡Perfil actualizado correctamente!';
        this.mensajeError = '';

        // Actualizo los datos locales con la respuesta del backend (que ya trae la nueva URL de Cloudinary)
        this.usuario = { 
          ...this.usuario, 
          ...res,
          fechaNacimiento: res.fechaNacimiento ? res.fechaNacimiento.substring(0, 10) : this.usuario.fechaNacimiento
        };
        this.selectedFile = null; // Limpio el archivo temporal

        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.mensajeExito = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        this.mensajeError = 'Hubo un error al actualizar el perfil.';
        this.mensajeExito = '';
        this.cdr.detectChanges();
      }
    });
  }
}
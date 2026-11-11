import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [CommonModule, FormsModule, CapitalizePipe],
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

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
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
    this.http.get(`${environment.apiUrl}/usuarios/${usuarioId}`, { headers }).subscribe({
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
    this.http.get<any[]>(`${environment.apiUrl}/publicaciones?usuarioId=${usuarioId}&limit=3&offset=0&orden=fecha`, { headers }).subscribe({
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

    this.usuarioService.actualizarPerfil(this.usuario._id, this.usuario).subscribe({
      next: (res) => {
        console.log('¡Backend respondió OK!', res);
        this.mensajeExito = '¡Perfil actualizado correctamente!';
        this.mensajeError = '';

        this.cdr.detectChanges();
        // Hace desaparecer el mensaje de éxito automáticamente a los 4 segundos
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
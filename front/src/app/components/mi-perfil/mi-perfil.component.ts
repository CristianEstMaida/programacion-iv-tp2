import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

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
      descripcion: 'Cargando perfil...'
    };

    // 1. Petición al backend para traer el perfil real de la BD
    this.http.get(`http://localhost:3000/api/usuarios/${usuarioId}`, { headers }).subscribe({
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
          descripcion: userData.descripcion || ''
        };

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el usuario del backend:', err);
      }
    });

    // 2. Traer las últimas 3 publicaciones
    this.http.get<any[]>(`http://localhost:3000/api/publicaciones?usuarioId=${usuarioId}&limit=3&offset=0&orden=fecha`, { headers }).subscribe({
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
    // Lógica para enviar los cambios del formulario al backend con PUT
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.put(`http://localhost:3000/api/usuarios/${this.usuario._id}`, this.usuario, { headers }).subscribe({
      next: () => alert('Perfil actualizado correctamente'),
      error: (err) => console.error('Error al actualizar', err)
    });
  }
}
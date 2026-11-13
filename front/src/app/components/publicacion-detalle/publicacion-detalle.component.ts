import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.css']
})
export class PublicacionDetalleComponent implements OnInit {
  publicacion: any = null;
  private apiUrl = 'https://programacion-iv-tp2-back.vercel.app/api/publicaciones'; // Ajusta según tu endpoint

  usuarioLogueadoId: string = '';
  
  // Variables para comentarios (con la misma lógica prolija que armaste)
  comentarios: any[] = [];
  page: number = 1;
  limit: number = 5;
  hayMasComentarios: boolean = true;
  nuevoComentarioTexto: string = '';
  comentarioEnEdicionId: string | null = null;
  textoEditado: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private publicacionesService: PublicacionesService
  ) {}

  ngOnInit(): void {
    this.extraerDatosToken();
    // Capturamos el ID de la URL (ej: /publicaciones/6ae5f72...)
    const id = this.route.snapshot.paramMap.get('id'); // O route.snapshot.params['id']
    if (id) {
      this.obtenerDetalle(id);
      this.cargarComentarios(id, true);
    }
  }

  // obtenerDetalle(id: string) {
  //   this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
  //     next: (data) => {
  //       this.publicacion = data;
  //       this.cdr.detectChanges();
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar el detalle de la publicación', err);
  //     }
  //   });
  // }

  obtenerDetalle(id: string) {
    this.publicacionesService.obtenerPublicacionPorId(id).subscribe({
      next: (data) => {
        this.publicacion = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar detalle de publicación', err)
    });
  }

  extraerDatosToken(): void {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.usuarioLogueadoId = String(payload.sub || payload.id || payload._id || '');
      }
    } catch (e) {
      console.error('Error al decodificar token', e);
    }
  }

  // Cargar comentarios paginados
  cargarComentarios(postId: string, reiniciar: boolean = false) {
    if (reiniciar) {
      this.page = 1;
      this.comentarios = [];
      this.hayMasComentarios = true;
    }

    this.publicacionesService.obtenerComentarios(postId, this.page, this.limit).subscribe({
      next: (res: any) => {
        const nuevos = res.data ? res.data : (Array.isArray(res) ? res : []);
        
        // Ordenar del último al más viejo (descendente por fecha)
        const ordenados = nuevos.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (reiniciar) {
          this.comentarios = ordenados;
        } else {
          // Filtro de seguridad: Evitamos duplicados comparando los _id
          const idsExistentes = new Set(this.comentarios.map(c => c._id || c.id));
          const unicosNuevos = ordenados.filter((c: any) => !idsExistentes.has(c._id || c.id));
          
          this.comentarios = [...this.comentarios, ...unicosNuevos];
        }

        if (ordenados.length < this.limit || (res.totalPages && this.page >= res.totalPages)) {
          this.hayMasComentarios = false;
        } else {
          this.hayMasComentarios = true;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar comentarios', err)
    });
  }

  cargarMasComentarios() {
    this.page++;
    if (this.publicacion) {
      this.cargarComentarios(this.publicacion._id || this.publicacion.id, false);
    }
  }

  agregarComentario() {
    if (!this.nuevoComentarioTexto.trim() || !this.publicacion) return;
    const postId = this.publicacion._id || this.publicacion.id;

    this.publicacionesService.crearComentario(postId, { mensaje: this.nuevoComentarioTexto }).subscribe({
      next: () => {
        this.nuevoComentarioTexto = '';
        this.page = 1;
        this.cargarComentarios(postId, true); // Recarga desde la página 1 para ver el nuevo arriba
      },
      error: (err) => console.error('Error al crear comentario', err)
    });
  }

  esComentarioPropio(c: any): boolean {
    const autorId = c.usuario?._id || c.usuario?.id || c.usuario;
    return String(autorId) === String(this.usuarioLogueadoId);
  }

  iniciarEdicion(c: any) {
    this.comentarioEnEdicionId = c._id || c.id;
    this.textoEditado = c.mensaje;
  }

  cancelarEdicion() {
    this.comentarioEnEdicionId = null;
    this.textoEditado = '';
  }

  guardarEdicion(comentarioId: string) {
    if (!this.textoEditado.trim()) return;

    this.publicacionesService.editarComentario(comentarioId, { mensaje: this.textoEditado }).subscribe({
      next: () => {
        this.comentarioEnEdicionId = null;
        this.textoEditado = '';
        if (this.publicacion) {
          this.cargarComentarios(this.publicacion._id || this.publicacion.id, true);
        }
      },
      error: (err) => console.error('Error al editar comentario', err)
    });
  }
}
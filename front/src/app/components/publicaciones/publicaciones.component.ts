import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicacionesService } from '../../services/publicaciones.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {

  publicaciones: any[] = [];
  usuarioLogueadoId: string = '';
  usuarioNombre: string = '';
  rolUsuario: string = '';

  // Controladores del Modal
  isModalOpen: boolean = false;
  nuevoTitulo: string = '';
  nuevaDescripcion: string = '';
  nuevaImagenUrl: string = '';

  // Variables de control para la paginación / scroll infinito
  limite: number = 10;
  offset: number = 0;
  cargando: boolean = false;

  todasCargadas: boolean = false;

  constructor(
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.extraerDatosToken();
    this.cargarPublicaciones();
  }

  // 2. Función para leer el token una sola vez al cargar el componente
  extraerDatosToken(): void {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Decodificamos la parte del payload del JWT (la segunda sección separada por puntos)
        const payloadPayload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadPayload));
        
        // Extraemos el ID del token (probando sub, id o _id)
        this.usuarioLogueadoId = String(decodedPayload.sub || decodedPayload.id || decodedPayload._id || '');

        const rolEncontrado = decodedPayload.rol || decodedPayload.perfil || '';
        this.rolUsuario = String(rolEncontrado).toLowerCase();
      }
    } catch (e) {
      console.error('Error al decodificar el token:', e);
    }

    console.log("ID del usuario extraído del token:", this.usuarioLogueadoId);
    console.log("Rol del usuario:", this.rolUsuario);
  }

  @HostListener('window:scroll', ['$event']) // Pasamos el evento correctamente
  onScroll(event: Event): void {
    const threshold = 300;
    const pos = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - threshold);
    if (pos && !this.cargando && !this.todasCargadas) {
      this.cargarPublicaciones();
    }
  }

  trackByPublicacionId(index: number, post: any): string {
   return post._id; // 👈 Esto le dice a Angular exactamente qué elemento es cuál, evitando que se mezclen
  }

  cargarPublicaciones() {
    if (this.cargando || this.todasCargadas) return; // Si ya cargó todo, no hace nada
    this.cargando = true;

    this.publicacionesService.obtenerPublicaciones({ limit: this.limite, offset: this.offset }).subscribe({
      next: (data: any) => {
        console.log("DATOS QUE LLEGAN DEL BACK:", data);
        const rawList = Array.isArray(data) ? data : (data.publicaciones || data.data || []);
        
        if (rawList.length === 0) {
          this.todasCargadas = true;
          this.cargando = false;
          return;
        }

        const currentUserId = String(this.usuarioLogueadoId).trim();
        // Mapeamos para asegurar tipos de datos limpios en los likes
        const nuevasPublicaciones = rawList.map((post: any) => {
          // Extraemos los IDs de los likes de manera ultra robusta
          const likesAsStrings = (post.likes || []).map((likeItem: any) => {
            if (!likeItem) return '';
            // Si el like es un objeto poblado (ej: { _id: '...', nombre: '...' }) o un ObjectId
            if (typeof likeItem === 'object') {
              return String(likeItem._id || likeItem.id || likeItem);
            }
            return String(likeItem).trim();
          });

          // Comparamos limpiando espacios y asegurando que ambos sean strings
          const likedByMe = likesAsStrings.includes(currentUserId);

          return {
            ...post,
            likes: likesAsStrings,
            likedByMe: likedByMe
          };
        });

        this.publicaciones = [...this.publicaciones, ...nuevasPublicaciones];
        
        this.offset += this.limite; // Incrementamos el offset para la próxima llamada
        this.cargando = false;
        // Forzamos a Angular a pintar la vista inmediatamente
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
      }
    });
  }

  // 1. Abrir modal para crear publicación (Aquí conectas tu lógica de modales que ya tenías)
  // Abrir y cerrar el Modal estético
  abrirModalCrear() {
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaImagenUrl = '';
  }

  // Enviar los datos al backend
  guardarPublicacion() {
    if (!this.nuevoTitulo || !this.nuevaDescripcion) return;

    const nuevaPublicacion = {
      titulo: this.nuevoTitulo,
      descripcion: this.nuevaDescripcion,
      imagenUrl: this.nuevaImagenUrl
    };

    this.publicacionesService.crearPublicacion(nuevaPublicacion).subscribe({
      next: (res) => {
        console.log('Publicación creada con éxito:', res);
        this.cargarPublicaciones(); // Recarga la lista para mostrar la nueva
        this.cerrarModal();         // Cierra y limpia el modal
      },
      error: (err) => {
        console.error('Error al crear la publicación:', err);
        alert('No se pudo crear la publicación');
      }
    });
  }
  // 2. Dar o quitar Me Gusta
  toggleMeGusta(post: any) {
    if (post.likedByMe) {
      this.publicacionesService.quitarMegusta(post._id).subscribe({
        next: () => {
          post.likedByMe = false;
          post.likesCount = Math.max(0, (post.likesCount || post.likes.length) - 1);
          post.likes = post.likes.filter((id: string) => id !== this.usuarioLogueadoId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al quitar like', err)
      });
    } else {
      this.publicacionesService.darMegusta(post._id).subscribe({
        next: () => {
          post.likedByMe = true;
          post.likesCount = (post.likesCount || post.likes.length) + 1;
          if (!post.likes) post.likes = [];
          if (!post.likes.includes(this.usuarioLogueadoId)) {
            post.likes.push(String(this.usuarioLogueadoId));
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al dar like', err)
      });
    }
  }

  // 3. Validar si la publicación pertenece al usuario logueado para mostrar el botón de eliminar
  puedeEliminar(post: any): boolean {
    const autorObj = post.usuario;
    if (!autorObj) return false;
    const autorId = String(autorObj._id || autorObj.id || autorObj);

    // 1. ¿Es el dueño del post?
    const esDueño = autorId === this.usuarioLogueadoId;

    // 2. ¿Es administrador? (asumiendo que guardas el rol en alguna variable o lo sacas del token)
    const esAdmin = this.rolUsuario === 'admin' || this.rolUsuario === 'administrador';

    // Puede eliminar si es suyo O si es admin
    return esDueño || esAdmin;
  }

  // 4. Eliminar publicación
  eliminarPublicacion(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.publicacionesService.eliminarPublicacion(id).subscribe({
        next: () => {
          this.publicaciones = this.publicaciones.filter(p => p._id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al eliminar publicación', err)
      });
    }
  }

  // 5. Toggle comentarios (Placeholder para cuando abras la sección de comentarios)
  toggleComentarios(post: any) {
    console.log('Ver comentarios de la publicación:', post._id);
  }
}
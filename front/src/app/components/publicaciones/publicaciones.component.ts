import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicacionesService } from '../../services/publicaciones.service';
import { FormsModule } from '@angular/forms';
import { PublicacionCardComponent } from '../publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, PublicacionCardComponent],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {

  publicaciones: any[] = [];
  usuarioLogueadoId: string = '';
  rolUsuario: string = '';

  // Controladores del Modal
  isModalOpen: boolean = false;
  nuevoTitulo: string = '';
  nuevaDescripcion: string = '';
  archivoSeleccionado: File | null = null;

  // Variables de control para la paginación / scroll infinito
  limite: number = 10;
  offset: number = 0;
  cargando: boolean = false;
  todasCargadas: boolean = false;

  ordenSeleccionado: 'fecha' | 'likes' = 'fecha';
  mostrarModalConfirmacion: boolean = false;
  publicacionAEliminarId: string | null = null;

  // --- VARIABLES PARA EL MANEJO DE COMENTARIOS ---
  publicacionSeleccionada: any = null; // Si tiene objeto, se abre el modal/detalle
  comentarios: any[] = [];
  page: number = 1;
  limit: number = 5; // Límite inicial de comentarios por tanda
  hasMore: boolean = true;
  nuevoComentarioTexto: string = '';
  comentarioEnEdicionId: string | null = null;
  textoEditado: string = '';


  constructor(
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
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
      this.cargarPublicaciones(this.ordenSeleccionado);
    }
  }

  trackByPublicacionId(index: number, post: any): string {
   return post._id; // Esto le dice a Angular exactamente qué elemento es cuál, evitando que se mezclen
  }

  cambiarOrden() {
    // 1. Reseteamos la paginación y el estado para empezar desde el principio
    this.publicaciones = [];
    this.offset = 0;
    this.todasCargadas = false;
    
    // Llama a tu método que recarga las publicaciones pasando el parámetro de orden
    this.cargarPublicaciones(this.ordenSeleccionado);
  }

  cargarPublicaciones(orden?: 'fecha' | 'likes') {
    // Si no se pasa un orden por parámetro, usamos el que tiene seleccionado el usuario en el select
    const ordenAUsar = orden || this.ordenSeleccionado;

    if (this.cargando || this.todasCargadas) return; // Si ya cargó todo, no hace nada
    this.cargando = true;

    console.log("Cargando publicaciones con orden:", ordenAUsar);

    this.publicacionesService.obtenerPublicaciones({ limit: this.limite, offset: this.offset, orden: ordenAUsar }).subscribe({
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
    this.mostrarModalConfirmacion = false;
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.mostrarModalConfirmacion = false;
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    //this.nuevaImagenUrl = '';
    this.cdr.detectChanges();
  }

  // Método que se dispara cuando el usuario selecciona un archivo
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  // Enviar los datos al backend
  // Asegúrate de tener una variable en tu clase que guarde el archivo, por ejemplo: 
  // public archivoSeleccionado: File | null = null;

  guardarPublicacion() {
    if (!this.nuevoTitulo || !this.nuevaDescripcion) return;

    // 1. Creamos un FormData en lugar de un objeto JSON plano
    const formData = new FormData();
    formData.append('titulo', this.nuevoTitulo);
    formData.append('descripcion', this.nuevaDescripcion);

    // 2. Si el usuario seleccionó un archivo físico, lo adjuntamos con la clave 'imagen'
    if (this.archivoSeleccionado) {
      formData.append('imagen', this.archivoSeleccionado);
    }

    // 3. Enviamos el FormData al servicio
    this.publicacionesService.crearPublicacion(formData).subscribe({
      next: (res) => {
        console.log('Publicación creada con éxito:', res);
        this.publicaciones.unshift(res); // Agrega la nueva publicación al inicio de la lista
        //this.cargarPublicaciones(); // Recarga la lista para mostrar la nueva
        this.cerrarModal();         // Cierra y limpia el modal
        this.archivoSeleccionado = null; // Limpiamos el archivo
      },
      error: (err) => {
        console.error('Error al crear la publicación:', err);
        this.snackBar.open('No se pudo crear la publicación. Intente nuevamente.', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'] // Opcional para darle color rojo
        });
      }
    });
  }
  // 2. Dar o quitar Me Gusta
  manejarToggleLike(post: any) {
    if (!post.likes) post.likes = [];

    // 1. GUARDAMOS EL ESTADO ANTERIOR (por si falla y hay que revertir)
    const estadoAnterior = post.likedByMe;

    // 2. CAMBIO OPTIMISTA INMEDIATO (La vista se actualiza en el primer clic)
    post.likedByMe = !estadoAnterior;

    if (post.likedByMe) {
      post.likesCount = (post.likesCount || post.likes.length) + 1;
      if (!post.likes.includes(String(this.usuarioLogueadoId))) {
        post.likes.push(String(this.usuarioLogueadoId));
      }
    } else {
      post.likesCount = Math.max(0, (post.likesCount || post.likes.length) - 1);
      post.likes = post.likes.filter((id: string) => String(id) !== String(this.usuarioLogueadoId));
    }

    // Si está ordenado por likes, reordenamos y rompemos referencia del array
    if (this.ordenSeleccionado === 'likes') {
      this.publicaciones.sort((a, b) => b.likesCount - a.likesCount);
      this.publicaciones = [...this.publicaciones];
    }

    // Forzamos el redibujado de la vista del padre al instante
    this.cdr.detectChanges();

    // 3. PETICIÓN AL BACKEND EN SEGUNDO PLANO
    const peticion$ = estadoAnterior 
      ? this.publicacionesService.quitarMegusta(post._id) 
      : this.publicacionesService.darMegusta(post._id);

    peticion$.subscribe({
      next: () => {
        // Éxito: el backend ya confirmó, la vista ya se había actualizado sola.
      },
      error: (err) => {
        console.error('Error al procesar el like', err);
        
        // SI FALLA EL BACKEND: Revertimos los cambios visuales
        post.likedByMe = estadoAnterior;
        if (estadoAnterior) {
          post.likesCount++;
          post.likes.push(String(this.usuarioLogueadoId));
        } else {
          post.likesCount = Math.max(0, post.likesCount - 1);
          post.likes = post.likes.filter((id: string) => String(id) !== String(this.usuarioLogueadoId));
        }
        this.cdr.detectChanges();
      }
    });
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


  // 2. Esta función la llamas desde el botón de la papelera en tu HTML (ej: (click)="prepararEliminacion(pub._id)")
  prepararEliminacion(id: string) {
    this.isModalOpen = false;
    this.publicacionAEliminarId = id;
    this.mostrarModalConfirmacion = true;
    this.cdr.detectChanges();
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.isModalOpen = false;
    this.publicacionAEliminarId = null;
    this.cdr.detectChanges();
  }

  // 3. Esta es la función que se ejecuta cuando el usuario hace clic en "Eliminar" DENTRO del modal
  confirmarEliminacion() {
    if (!this.publicacionAEliminarId) return;
    
    this.publicacionesService.eliminarPublicacion(this.publicacionAEliminarId).subscribe({
      next: () => {
        this.publicaciones = this.publicaciones.filter(p => p._id !== this.publicacionAEliminarId);
        this.cerrarModalConfirmacion();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar publicación', err);
        this.cerrarModalConfirmacion();
      }
    });
  }

  // 1. Cuando hacen clic en "Comentarios" en la card, abrimos el detalle y cargamos los primeros comentarios
  verComentarios(post: any) {
    this.publicacionSeleccionada = post;
    this.cargarComentarios(true);
  }

  cerrarDetalleComentarios() {
    this.publicacionSeleccionada = null;
    this.comentarios = [];
    this.page = 1;
    this.hasMore = true;
    this.cdr.detectChanges();
  }

  // 2. GET: Cargar comentarios con paginación (ordenados por fecha descendente desde el back)
  cargarComentarios(reiniciar: boolean = false) {
    if (!this.publicacionSeleccionada) return;
    const postId = this.publicacionSeleccionada._id || this.publicacionSeleccionada.id;

    if (reiniciar) {
      this.page = 1;
      this.comentarios = [];
    }

    // Llamada a tu servicio backend (ajusta el nombre del método según tu service)
    this.publicacionesService.obtenerComentarios(postId, this.page, this.limit).subscribe({
      next: (res: any) => {
        const nuevos = res.data ? res.data : res;
        
        if (reiniciar) {
          this.comentarios = nuevos;
        } else {
          this.comentarios = [...this.comentarios, ...nuevos];
        }

        // Si trae menos del límite o llegamos al final, ocultamos el botón "Cargar más"
        if (nuevos.length < this.limit || (res.totalPages && this.page >= res.totalPages)) {
          this.hasMore = false;
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar comentarios', err)
    });
  }

  cargarMasComentarios() {
    this.page++;
    this.cargarComentarios(false);
  }

  // 3. POST: Agregar nuevo comentario
  agregarComentario() {
    if (!this.nuevoComentarioTexto.trim() || !this.publicacionSeleccionada) return;
    const postId = this.publicacionSeleccionada._id || this.publicacionSeleccionada.id;

    this.publicacionesService.crearComentario(postId, { mensaje: this.nuevoComentarioTexto }).subscribe({
      next: () => {
        this.nuevoComentarioTexto = '';
        this.cargarComentarios(true); // Recargamos desde la página 1 para ver el nuevo arriba
      },
      error: (err: any) => console.error('Error al crear comentario', err)
    });
  }

  // 4. Validar si el comentario es propio para mostrar el botón de Editar
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

  // 5. PUT: Guardar edición de comentario (el backend se encarga de poner modificado: true)
  guardarEdicion(comentarioId: string) {
    if (!this.textoEditado.trim()) return;

    this.publicacionesService.editarComentario(comentarioId, { mensaje: this.textoEditado }).subscribe({
      next: () => {
        this.comentarioEnEdicionId = null;
        this.textoEditado = '';
        this.cargarComentarios(true); // Refrescamos para ver el cartel de (Editado)
      },
      error: (err: any) => console.error('Error al editar comentario', err)
    });
  }
}
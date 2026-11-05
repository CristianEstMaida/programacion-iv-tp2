import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './publicacion-card.html',
  styleUrls: ['./publicacion-card.css']
})
export class PublicacionCardComponent {
  @Input() publicacion: any;
  @Input() usuarioLogueadoId: string = '';
  @Input() rolUsuario: string = '';

  // Eventos que avisan al componente principal que el usuario interactuó
  @Output() onToggleLike = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onVerComentarios = new EventEmitter<any>();

  // 1. Validar si puede eliminar (Lógica que tenías en el padre)
  puedeEliminar(): boolean {
    const autorObj = this.publicacion.usuario;
    if (!autorObj) return false;
    const autorId = String(autorObj._id || autorObj.id || autorObj);

    const esDueño = autorId === this.usuarioLogueadoId;
    const esAdmin = this.rolUsuario === 'admin' || this.rolUsuario === 'administrador';

    return esDueño || esAdmin;
  }

  // 2. Acciones que disparan los eventos hacia el componente principal
  toggleMeGusta() {
    this.onToggleLike.emit(this.publicacion);
  }

  // prepararEliminacion() {
  //   const id = this.publicacion._id || this.publicacion.id;
  //   this.onDelete.emit(id);
  // }

  eliminar() {
    const id = this.publicacion._id || this.publicacion.id;
    this.onDelete.emit(id);
  }

  verComentarios() {
    // Si usas routing directo a la página de detalle:
    // router.navigate(['/publicaciones', this.publicacion._id]);
    // O si usas un evento para abrir modal / desplegar:
    this.onVerComentarios.emit(this.publicacion);
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.css']
})
export class PublicacionDetalleComponent implements OnInit {
  publicacion: any = null;
  private apiUrl = 'https://programacion-iv-tp2-back.vercel.app/api/publicaciones'; // Ajusta según tu endpoint

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Capturamos el ID de la URL (ej: /publicaciones/6ae5f72...)
    const id = this.route.snapshot.paramMap.get('id'); // O route.snapshot.params['id']
    if (id) {
      this.obtenerDetalle(id);
    }
  }

  obtenerDetalle(id: string) {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (data) => {
        this.publicacion = data;
      },
      error: (err) => {
        console.error('Error al cargar el detalle de la publicación', err);
      }
    });
  }
}
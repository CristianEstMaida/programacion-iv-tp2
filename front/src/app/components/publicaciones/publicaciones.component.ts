import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publicaciones',
  imports: [
    CommonModule
  ],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {
  publicaciones: any[] = [
    {
      titulo: 'Bienvenidos al Sprint 1',
      mensaje: 'Ya tenemos configurado NestJS, MongoDB y Angular funcionando a la perfección.',
      autor: 'Sofía Valenzuela',
      fecha: '2026-10-25',
      likes: 5,
      imagen: ''
    }
  ];

  ngOnInit(): void {}

  abrirModalCrear() {
    // Aquí puedes disparar la apertura de un modal personalizado
    console.log('Abrir modal de nueva publicación');
  }

  darMegusta(post: any) {
    post.likes++;
  }

  toggleComentarios(post: any) {
    // Lógica para mostrar/ocultar comentarios
  }
}
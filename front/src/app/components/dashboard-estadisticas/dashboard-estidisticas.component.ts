import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-estadisticas.component.html',
  styleUrls: ['./dashboard-estadisticas.component.css']
})
export class DashboardEstadisticasComponent implements OnInit, AfterViewInit {
  
  // 📅 Reemplazamos el lapso por los filtros de fecha Desde y Hasta
  fechaDesde: string = '';
  fechaHasta: string = '';
  
  @ViewChild('graficoPublicaciones') graficoPublicacionesRef!: ElementRef;
  @ViewChild('graficoComentariosTiempo') graficoComentariosTiempoRef!: ElementRef;
  @ViewChild('graficoComentariosPubli') graficoComentariosPubliRef!: ElementRef;

  private chartPubli: any;
  private chartComentarios: any;
  private chartComentariosPubli: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Opcional: podemos inicializar con fechas por defecto (ej: el último mes hasta hoy)
    this.inicializarFechasPorDefecto();
  }

  ngAfterViewInit(): void {
    this.cargarEstadisticas();
  }

  // Establece un rango por defecto al cargar (ej: últimos 30 días)
  inicializarFechasPorDefecto() {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);

    this.fechaFin = hoy.toISOString().split('T')[0];
    this.fechaInicio = haceUnMes.toISOString().split('T')[0]; // o this.fechaDesde
  }

  // Setter auxiliar para mantener compatibilidad con las variables que usabas
  get fechaInicio(): string { return this.fechaDesde; }
  set fechaInicio(val: string) { this.fechaDesde = val; }

  get fechaFin(): string { return this.fechaHasta; }
  set fechaFin(val: string) { this.fechaHasta = val; }

  // Método que se ejecuta al hacer clic en filtrar o cambiar las fechas
  actualizarFiltro() {
    console.log(`Filtrando estadísticas desde ${this.fechaDesde} hasta ${this.fechaHasta}`);
    this.cargarEstadisticas();
  }

  // Método que trae los datos usando los inputs de fecha seleccionados
  cargarEstadisticas() {
    // Si todavía no hay fechas cargadas, salimos para evitar llamadas vacías
    if (!this.fechaDesde || !this.fechaHasta) return;

    const token = localStorage.getItem('access_token');
    // Si tu backend requiere token por headers, agrégalo aquí o confía en el interceptor HTTP global que ya configuramos.

    // 1. Publicaciones por usuario
    this.http.get<any>(`https://programacion-iv-tp2-back.vercel.app/api/publicaciones/estadisticas/publicaciones-por-usuario?inicio=${this.fechaDesde}&fin=${this.fechaHasta}`)
      .subscribe({
        next: (data) => {
          const labels = data.map((item: any, index: number) => `Usuario ${index + 1}`);
          const valores = data.map((item: any) => item.totalPublicaciones);
          this.actualizarGraficoPubli(labels, valores);
        },
        error: (err) => console.error('Error al cargar pubs:', err)
      });

    // 2. Comentarios en el tiempo
    this.http.get<any>(`https://programacion-iv-tp2-back.vercel.app/api/publicaciones/estadisticas/total-comentarios?inicio=${this.fechaDesde}&fin=${this.fechaHasta}`)
      .subscribe({
        next: (data) => {
          const total = data.length > 0 ? (data[0].totalComentarios || 0) : 0;
          const labels = [`${this.fechaDesde} al ${this.fechaHasta}`];
          const valores = [total];
          this.actualizarGraficoComentarios(labels, valores);
        },
        error: (err) => console.error('Error al cargar comentarios tiempo:', err)
      });

    // 3. Comentarios por cada publicación
    this.http.get<any>(`https://programacion-iv-tp2-back.vercel.app/api/publicaciones/estadisticas/comentarios-por-publicacion?inicio=${this.fechaDesde}&fin=${this.fechaHasta}`)
      .subscribe({
        next: (data) => {
          const labels = data.map((item: any, index: number) => `Publicación ${index + 1}`);
          const valores = data.map((item: any) => item.totalComentarios);
          this.actualizarGraficoComentariosPubli(labels, valores);
        },
        error: (err) => console.error('Error al cargar comentarios por pub:', err)
      });
  }

  actualizarGraficoPubli(labels: string[], valores: number[]) {
    if (this.chartPubli) this.chartPubli.destroy();
    const ctx = this.graficoPublicacionesRef.nativeElement.getContext('2d');
    this.chartPubli = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Publicaciones realizadas',
          data: valores,
          backgroundColor: '#2e7d32' // Manteniendo tu verde institucional
        }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false // 👈 Vital para que respete el contenedor sin estirarse mal
        }
    });
  }

  actualizarGraficoComentarios(labels: string[], valores: number[]) {
    if (this.chartComentarios) this.chartComentarios.destroy();
    const ctx = this.graficoComentariosTiempoRef.nativeElement.getContext('2d');
    this.chartComentarios = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de comentarios',
          data: valores,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  actualizarGraficoComentariosPubli(labels: string[], valores: number[]) {
    if (this.chartComentariosPubli) this.chartComentariosPubli.destroy();
    const ctx = this.graficoComentariosPubliRef.nativeElement.getContext('2d');
    this.chartComentariosPubli = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Comentarios por Publi',
          data: valores,
          backgroundColor: ['#2e7d32', '#4caf50', '#81c784', '#c8e6c9', '#1b5e20']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
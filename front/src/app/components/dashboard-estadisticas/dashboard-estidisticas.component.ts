import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Registramos los componentes de Chart.js

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-estadisticas.component.html',
  styleUrls: ['./dashboard-estadisticas.component.css']
})
export class DashboardEstadisticasComponent implements OnInit/*, AfterViewInit*/ {
  
  // Filtros de tiempo (pueden ser fechas o selector de rango)
  lapsoTiempo: string = 'mes'; // ej: 'semana', 'mes', 'anio'
  
  // Referencias a los canvas del HTML para los gráficos
  @ViewChild('graficoPublicaciones') graficoPublicacionesRef!: ElementRef;
  @ViewChild('graficoComentariosTiempo') graficoComentariosTiempoRef!: ElementRef;
  @ViewChild('graficoComentariosPubli') graficoComentariosPubliRef!: ElementRef;

  private chartPubli: any;
  private chartComentarios: any;
  private chartComentariosPubli: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Aquí puedes llamar a tu servicio para traer los datos iniciales
  }

     ngAfterViewInit(): void {
        this.cargarEstadisticas();
  }

  // Método que se ejecuta al cambiar el filtro de tiempo
  actualizarFiltro() {
    console.log('Cambiando lapso de tiempo a:', this.lapsoTiempo);
    // Aquí harías un fetch al backend pasando el filtro y actualizarías los gráficos
    //this.renderizarGraficos();
    this.cargarEstadisticas();
  }

  // Método que se ejecuta al iniciar y al cambiar el filtro
  cargarEstadisticas() {

    const hoy = new Date();
    let fechaInicio = new Date();
    let fechaFin = new Date();

    // Calculamos el inicio según el lapso elegido
    if (this.lapsoTiempo === 'semana') {
      // Restamos 7 días
      fechaInicio.setDate(hoy.getDate() - 7);
    } else if (this.lapsoTiempo === 'mes') {
      // Restamos 1 mes (o 30 días)
      fechaInicio.setMonth(hoy.getMonth() - 1);
    } else if (this.lapsoTiempo === 'anio') {
      // Restamos 1 año
      fechaInicio.setFullYear(hoy.getFullYear() - 1);
    }

    // Formateamos a string YYYY-MM-DD que es lo que espera el backend
    const inicio = fechaInicio.toISOString().split('T')[0];
    const fin = fechaFin.toISOString().split('T')[0];

    console.log(`Calculando fechas para [${this.lapsoTiempo}] -> Inicio: ${inicio}, Fin: ${fin}`);

    // Suponiendo que tu backend tiene endpoints para estas estadísticas pasando el lapso:
    // 1. Publicaciones por usuario
    this.http.get<any>(`https://programacion-iv-tp2-back.vercel.app/api/publicaciones/estadisticas/publicaciones-por-usuario?inicio=${inicio}&fin=${fin}`,)
      .subscribe({
        next: (data) => {
          // Mapeamos las etiquetas (eje X) usando una porción del _id de MongoDB por ahora
          const labels = data.map((item: any, index: number) => `Usuario ${index + 1}`);

          // Mapeamos los valores numéricos (eje Y)
          const valores = data.map((item: any) => item.totalPublicaciones);

          // Actualizamos el gráfico de barras
          this.actualizarGraficoPubli(labels, valores);
        },
        error: (err) => console.error('Error al cargar pubs:', err)
      });

    // 2. Comentarios en el tiempo
    this.http.get<any>(`https://programacion-iv-tp2-back.vercel.app/api/publicaciones/estadisticas/total-comentarios?inicio=${inicio}&fin=${fin}`)
      .subscribe({
        next: (data) => {
          // Como viene en un array, sumamos o extraemos el totalComentarios (o tomamos el primer elemento)
          const total = data.length > 0 ? (data[0].totalComentarios || 0) : 0;

          // Para que el gráfico de líneas lo dibuje bien, le pasamos una etiqueta de período y el valor numérico
          const labels = [this.lapsoTiempo.toUpperCase()];
          const valores = [total];

          this.actualizarGraficoComentarios(labels, valores);
        },
        error: (err) => console.error('Error al cargar comentarios tiempo:', err)
      });

    // 3. Comentarios por cada publicación
    this.http.get<any>(`https://programacion-iv-tp2-back.vercel.app/api/publicaciones/estadisticas/comentarios-por-publicacion?inicio=${inicio}&fin=${fin}`)
      .subscribe({
        next: (data) => {
          // En lugar del _id, usamos "Publicación 1", "Publicación 2", etc.
          const labels = data.map((item: any, index: number) => `Publicación ${index + 1}`);

          // Mapeamos los valores numéricos correspondientes a los comentarios
          const valores = data.map((item: any) => item.totalComentarios);

          // Actualizamos el gráfico de torta/doughnut
          this.actualizarGraficoComentariosPubli(labels, valores);
        },
        error: (err) => console.error('Error al cargar comentarios por pub:', err)
      });
  }

  // 1. Método para actualizar el gráfico de publicaciones
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
          backgroundColor: '#3b82f6'
        }]
      }
    });
  }

  // 2. Método para actualizar el gráfico de comentarios en el tiempo
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
          borderColor: '#10b981',
          tension: 0.1
        }]
      }
    });
  }

  // 3. Método para actualizar el gráfico de comentarios por publicación
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
          backgroundColor: ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981']
        }]
      }
    });
  }
}
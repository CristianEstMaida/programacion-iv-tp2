import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  
  // Reemplazamos el lapso por los filtros de fecha Desde y Hasta
  fechaDesde: string = '';
  fechaHasta: string = '';
  mensajeError: string = ''; // Agregamos la propiedad para el error
  tieneComentarios: boolean = true;
  tieneComentariosPubli: boolean = true;
  anchoDinamicoGrafico: number = 600; // Ancho base inicial por defecto
  anchoDinamicoPubli: number = 600;

  @ViewChild('graficoPublicaciones') graficoPublicacionesRef!: ElementRef;
  @ViewChild('graficoComentariosTiempo') graficoComentariosTiempoRef!: ElementRef;
  @ViewChild('graficoComentariosPubli') graficoComentariosPubliRef!: ElementRef;

  private chartPubli: any;
  private chartComentarios: any;
  private chartComentariosPubli: any;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Opcional: podemos inicializar con fechas por defecto (ej: el último mes hasta hoy)
    this.inicializarFechasPorDefecto();
  }

  ngAfterViewInit(): void {
    this.cargarEstadisticas();
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '';
    // Si viene en formato "YYYY-MM-DD", lo pasa a "DD/MM/YYYY"
    if (fechaStr.includes('-')) {
      const partes = fechaStr.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }
    return fechaStr; // Si ya venía con barras, lo devuelve tal cual
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

  // Método auxiliar para obtener la fecha actual en formato YYYY-MM-DD
  getFechaHoy(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  // Método que se ejecuta al hacer clic en filtrar o cambiar las fechas
  actualizarFiltro() {
    if (!this.fechaDesde || !this.fechaHasta) {
      this.mensajeError = 'Por favor, completá ambas fechas para filtrar.';
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const dDesde = new Date(this.fechaDesde);
    const dHasta = new Date(this.fechaHasta);

    // Validaciones defensivas de fechas
    if (dHasta > hoy) {
      this.mensajeError = 'La fecha "Hasta" no puede ser posterior a la actual.';
      this.fechaHasta = this.getFechaHoy();
      return;
    }

    if (dDesde > dHasta) {
      this.mensajeError = 'La fecha "Desde" no puede ser mayor que la fecha "Hasta".';
      return;
    }

    console.log(`Filtrando estadísticas desde ${this.fechaDesde} hasta ${this.fechaHasta}`);
    this.cargarEstadisticas();
  }

  // Método que trae los datos usando los inputs de fecha seleccionados
  cargarEstadisticas() {
    // Si todavía no hay fechas cargadas, salimos para evitar llamadas vacías
    if (!this.fechaDesde || !this.fechaHasta) return;

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
          // Evaluamos si hay comentarios reales
          this.tieneComentarios = total > 0;
          
          const rangoTexto = `${this.formatearFecha(this.fechaDesde)} al ${this.formatearFecha(this.fechaHasta)}`;
          const labels = [rangoTexto];
          const valores = [total];
          this.actualizarGraficoComentarios(labels, valores);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar comentarios tiempo:', err)
      });

    // 3. Comentarios por cada publicación
    this.http.get<any>(`https://programacion-iv-tp2-back.vercel.app/api/publicaciones/estadisticas/comentarios-por-publicacion?inicio=${this.fechaDesde}&fin=${this.fechaHasta}`)
      .subscribe({
        next: (data) => {
          console.log("🔍 LO QUE LLEGA DEL BACKEND:", data);
          // Evalúo si el array tiene datos reales
          if (data && data.length > 0) {
            const totalComentariosSuma = data.reduce((acc: number, item: any) => acc + (item.totalComentarios || 0), 0);
            this.tieneComentariosPubli = totalComentariosSuma > 0;

            const labels = data.map((item: any, index: number) => `Publicación ${index + 1}`);
            const valores = data.map((item: any) => item.totalComentarios);
            this.actualizarGraficoComentariosPubli(labels, valores);
          } else {
            // Si llega [] vacío, forzamos a false para que se muestre el estado vacío
            this.tieneComentariosPubli = false;
          }

          // Obligamos a Angular a refrescar la vista al instante
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar comentarios por pub:', err);
          this.tieneComentariosPubli = false;
        }
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
          backgroundColor: '#2e7d32', // Manteniendo tu verde institucional
          borderRadius: 6,
          maxBarThickness: 40
        }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Vital para que respete el contenedor sin estirarse mal
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 0
              }
            }
          }
        }
    });
    
  }

  actualizarGraficoComentarios(labels: string[], valores: number[]) {
    if (this.chartComentarios) this.chartComentarios.destroy();
    // const ctx = this.graficoComentariosTiempoRef.nativeElement.getContext('2d');
    // this.chartComentarios = new Chart(ctx, {
    //   type: 'line',
    //   data: {
    //     labels: labels,
    //     datasets: [{
    //       label: 'Cantidad de comentarios',
    //       data: valores,
    //       borderColor: '#2e7d32',
    //       backgroundColor: 'rgba(46, 125, 50, 0.1)',
    //       fill: true,
    //       tension: 0.1
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     scales: {
    //       y: {
    //         beginAtZero: true, 
    //         ticks: {
    //           stepSize: 1 
    //         }
    //       }
    //     }
    //   }
    // });
    if (this.chartComentarios) this.chartComentarios.destroy();

    // Mapeamos los datos a puntos {x, y} para el scatter
    const datosScatter = valores.map((val, index) => ({
      x: index + 1, // Posición cronológica en el eje X
      y: val        // Cantidad de comentarios en ese punto del tiempo
    }));

    const ctx = this.graficoComentariosTiempoRef.nativeElement.getContext('2d');
    this.chartComentarios = new Chart(ctx, {
      type: 'scatter', // Gráfico de dispersión (puntos distribuidos, ni línea ni barra)
      data: {
        datasets: [{
          label: 'Total Comentarios Acumulado en el Período',
          data: datosScatter,
          backgroundColor: '#2e7d32',
          pointRadius: 10,
          pointHoverRadius: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          // ACÁ ESTÁ LA CLAVE PARA PERSONALIZAR EL MENSAJE DEL TOOLTIP
          tooltip: {
            callbacks: {
              title: () => 'Resumen del Lapso',
              label: (context) => {
                const valor = context.parsed.y;
                const periodo = labels[0] || '';
                return [
                  ` Período: ${periodo}`,
                  ` Total de comentarios: ${valor}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            min: 0.5,
            max: 1.5,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                return Number(value) === 1 ? (labels[0] || '') : '';
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    // const ctx = this.graficoComentariosTiempoRef.nativeElement.getContext('2d');
    // this.chartComentarios = new Chart(ctx, {
    //   type: 'bar', 
    //   data: {
    //     labels: labels,
    //     datasets: [{
    //       label: 'Cantidad de comentarios',
    //       data: valores,
    //       backgroundColor: '#2e7d32',
    //       borderRadius: 4
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: {
    //       legend: { display: false }
    //     },
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //         ticks: { stepSize: 1 }
    //       },
    //       x: {
    //         ticks: {
    //           maxRotation: 45,
    //           minRotation: 0
    //         }
    //       }
    //     }
    //   }
    // });
  }

  actualizarGraficoComentariosPubli(labels: string[], valores: number[]) {
    this.anchoDinamicoGrafico = Math.max(600, labels.length * 45);
    if (this.chartComentariosPubli) this.chartComentariosPubli.destroy();
    
    const ctx = this.graficoComentariosPubliRef.nativeElement.getContext('2d');
    
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(46, 125, 50, 0.5)');
    gradient.addColorStop(1, 'rgba(46, 125, 50, 0.0)');

    this.chartComentariosPubli = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: labels,
        datasets: [{
          label: 'Comentarios por Publicación',
          data: valores,
          borderColor: '#2e7d32',
          backgroundColor: gradient, 
          fill: true, 
          tension: 0.3, 
          pointBackgroundColor: '#1b5e20',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 15,  
            right: 15 
          }
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0
            }
          }
        }
      }
    });
  }
}
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
import { AdminGuard } from '../guards/jwt-auth/admin.guard.js';
import { PublicacionesService } from './publicaciones.service.js';

@Controller('publicaciones/estadisticas')
@UseGuards(JwtAuthGuard, AdminGuard) //  ¡Protege todo el controlador para que solo entren los admin!
export class EstadisticasController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // GET: Total de publicaciones y métricas generales
  @Get('resumen')
  async getResumen() {
    return await this.publicacionesService.obtenerResumenEstadisticas();
  }

  // GET: Publicaciones agrupadas por mes o por día (ideal para gráficos de líneas/barras)
  @Get('por-fecha')
  async getPublicacionesPorFecha() {
    return await this.publicacionesService.obtenerPublicacionesPorFecha();
  }
}
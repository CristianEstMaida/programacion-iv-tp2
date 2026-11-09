import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
import { AdminGuard } from '../guards/jwt-auth/admin.guard.js';
import { PublicacionesService } from './publicaciones.service.js';

@Controller('publicaciones/estadisticas')
@UseGuards(JwtAuthGuard, AdminGuard) //  ¡Protege todo el controlador para que solo entren los admin!
export class EstadisticasController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

 // 1. Cantidad de publicaciones por usuario en un lapso de tiempo
  @Get('publicaciones-por-usuario')
  async getPublicacionesPorUsuario(
    @Query('inicio') inicio: string,
    @Query('fin') fin: string,
  ) {
    return await this.publicacionesService.obtenerPublicacionesPorUsuario(inicio, fin);
  }

  // 2. Cantidad total de comentarios realizados en un lapso de tiempo
  @Get('total-comentarios')
  async getTotalComentarios(
    @Query('inicio') inicio: string,
    @Query('fin') fin: string,
  ) {
    return await this.publicacionesService.obtenerTotalComentariosPorTiempo(inicio, fin);
  }

  // 3. Cantidad de comentarios en cada publicación en un lapso de tiempo
  @Get('comentarios-por-publicacion')
  async getComentariosPorPublicacion(
    @Query('inicio') inicio: string,
    @Query('fin') fin: string,
  ) {
    return await this.publicacionesService.obtenerComentariosPorPublicacion(inicio, fin);
  }
}
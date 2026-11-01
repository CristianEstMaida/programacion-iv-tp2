import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
import express from 'express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // 1. CREAR PUBLICACIÓN (Asociada al usuario autenticado)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPublicacioneDto: CreatePublicacioneDto, 
    @Req() req: express.Request
  ) {
    console.log("CONTENIDO DE REQ.USER:", (req as any).user);
    const user = (req as any).user;
    
    // Validamos por si el token viene estructurado con 'id', '_id' o 'sub'
    const userId = user?.userId || user?.id || user?._id || user?.sub;

    if (!userId) {
      throw new UnauthorizedException('No se pudo identificar al usuario desde el token');
    }

    return this.publicacionesService.create(createPublicacioneDto, userId);
  }

  // 2. LISTAR CON FILTROS, ORDENAMIENTO Y PAGINACIÓN
  @Get()
  findAll(
    @Query('usuarioId') usuarioId?: string,
    @Query('orden') orden?: 'fecha' | 'likes',
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.publicacionesService.findAll({
      usuarioId: usuarioId,
      orden: orden || 'fecha',
      limit: limit ? +limit : 10,
      offset: offset ? +offset : 0,
    });
  }

  // 3. BAJA LÓGICA (Solo dueño o admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: express.Request) {
    const usuarioLogueado = req.user; // Debe contener id y rol/es
    return this.publicacionesService.softDelete(id, usuarioLogueado);
  }

  // 4. DAR "ME GUSTA" (Un solo like por usuario)
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  darLike(@Param('id') id: string, @Req() req: express.Request) {
    const user = (req as any).user;
    const userId = user?.userId || user?.id || user?._id || user?.sub;
    return this.publicacionesService.darLike(id, userId);
  }

  // 5. QUITAR "ME GUSTA"
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  quitarLike(@Param('id') id: string, @Req() req: express.Request) {
    const user = (req as any).user;
    const userId = user?.userId || user?.id || user?._id || user?.sub;
    return this.publicacionesService.quitarLike(id, userId);
  }
}
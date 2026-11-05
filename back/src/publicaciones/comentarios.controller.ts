import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ComentariosService } from './comentarios.service.js';

@Controller('publicaciones') // Las rutas base empiezan con /publicaciones
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  // GET: Traer comentarios de una publicación con paginación y ordenados por más recientes
  @Get(':publicacionId/comentarios')
  async obtenerComentarios(
    @Param('publicacionId') publicacionId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.comentariosService.obtenerPorPublicacion(publicacionId, Number(page), Number(limit));
  }

  // POST: Agregar un comentario a una publicación
  @Post(':publicacionId/comentarios')
  // @UseGuards(JwtAuthGuard) // Tu guardia si lo usas
  async agregarComentario(
    @Param('publicacionId') publicacionId: string,
    @Body() body: { mensaje: string },
    @Req() req: any,
  ) {
    // Si extraes el usuario del token:
    const usuarioId = req.user?.userId || req.user?.id; 
    return this.comentariosService.crear(publicacionId, usuarioId, body.mensaje);
  }

  // PUT: Modificar el mensaje y marcar modificado: true
  @Put('comentarios/:id')
  // @UseGuards(JwtAuthGuard)
  async modificarComentario(
    @Param('id') id: string,
    @Body() body: { mensaje: string },
  ) {
    return this.comentariosService.actualizar(id, body.mensaje);
  }
}




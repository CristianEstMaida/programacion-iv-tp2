import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
import express from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService, private readonly cloudinaryService: CloudinaryService) {}

  // 1. CREAR PUBLICACIÓN (Asociada al usuario autenticado)
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('imagen')) // Intercepta el archivo con el nombre 'imagen' del FormData
  async create(
    @Body() createPublicacioneDto: CreatePublicacioneDto, 
    @Req() req: express.Request,
    @UploadedFile() file?: Express.Multer.File // Recibe el archivo opcionalmente
  ) {
    console.log("ARCHIVO RECIBIDO EN BACKEND:", file);
    console.log("1. HEADER AUTHORIZATION:", req.headers.authorization);
    const user = (req as any).user;
    console.log("2. USUARIO DECODIFICADO DEL TOKEN:", user);
    const userId = user?.userId || user?.id || user?._id || user?.sub;

    if (!userId) {
      throw new UnauthorizedException('No se pudo identificar al usuario desde el token');
    }

    let imagenUrl = '';

    // Si el usuario adjuntó un archivo físico, lo subimos a Cloudinary
    if (file) {
      const uploadResult: any = await this.cloudinaryService.uploadImage(file);
      imagenUrl = uploadResult.secure_url; // Obtenemos la URL segura de Cloudinary
    }

    // Llamamos al servicio pasando la URL final de la imagen
    return this.publicacionesService.create(createPublicacioneDto, userId, imagenUrl);
  }

  // 2. LISTAR CON FILTROS, ORDENAMIENTO Y PAGINACIÓN
  @UseGuards(JwtAuthGuard)
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
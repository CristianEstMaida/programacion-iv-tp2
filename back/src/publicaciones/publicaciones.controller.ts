import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mi-perfil-o-recurso-privado')
  // obtenerDatosPrivados(@Req() req) {
  //   // req.user contiene lo que devolvió el método validate() de la estrategia JWT
  //   const usuarioAutenticado = req.user; 
    
  //   return {
  //     mensaje: 'Acceso concedido a ruta protegida',
  //     usuario: usuarioAutenticado,
  //   };
  // }
  @Post()
  create(@Body() createPublicacioneDto: CreatePublicacioneDto) {
    return this.publicacionesService.create(createPublicacioneDto);
  }

  @Get()
  findAll() {
    return this.publicacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacioneDto: UpdatePublicacioneDto) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(+id);
  }
}

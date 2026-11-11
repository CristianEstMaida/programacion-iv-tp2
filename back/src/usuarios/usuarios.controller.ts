import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, UseGuards, BadRequestException, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
import { AdminGuard } from '../guards/jwt-auth/admin.guard.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly cloudinaryService: CloudinaryService, // 👈 Inyectamos Cloudinary
  ) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, webp)'), false);
        }
        callback(null, true);
      },
    }),
  )
  async registrar(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imagenUrl: string | undefined = undefined;

    // Si el usuario subió una imagen, la mandamos a Cloudinary en lugar de guardar en disco
    if (file) {
      const uploadResult: any = await this.cloudinaryService.uploadImage(file);
      imagenUrl = uploadResult.secure_url; // Obtenemos la URL pública de la nube
    }

    // Le pasamos la URL de Cloudinary al servicio en lugar del nombre de archivo local
    return await this.usuariosService.registrar(createUsuarioDto, imagenUrl);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('imagenPerfil', { // Debe coincidir con el campo que mandas desde Angular
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, webp)'), false);
        }
        callback(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Le pasamos el ID, el DTO y el archivo opcional al servicio unificado
    console.log("Archivo recibido en backend:", file);
    return await this.usuariosService.update(id, updateUsuarioDto, file);
  }
  // Baja lógica (Solo Admin)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.bajaLogica(id);
  }


  // Alta lógica / Rehabilitar (Solo Admin)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/activar')
  rehabilitar(@Param('id') id: string) {
    return this.usuariosService.rehabilitar(id); // Llamas al método del servicio
  }
  
}
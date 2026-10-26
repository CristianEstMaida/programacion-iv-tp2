import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Controller('autenticacion')
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
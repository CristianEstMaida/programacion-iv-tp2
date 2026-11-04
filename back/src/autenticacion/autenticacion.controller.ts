import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service.js';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto.js';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/index.js';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService, private readonly cloudinaryService: CloudinaryService, private readonly usuariosService: UsuariosService,) {}

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async obtenerPerfilPropio(@Req() req: Request & { user: { userId: string; email: string; perfil: string } }) {
    // req.user.userId viene del payload del token JWT validado por la estrategia
    const userId = req.user.userId;
    
    return await this.autenticacionService.getPerfil(userId);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.autenticacionService.login(loginDto);
  }

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

  @Post()
  create(@Body() createAutenticacionDto: CreateAutenticacionDto) {
    return this.autenticacionService.create(createAutenticacionDto);
  }

  @UseGuards(JwtAuthGuard) // El guard que ya uses para proteger rutas
  @Post('autorizar')
  autorizarToken(@Req() req: Request & { user: { userId: string; email: string; perfil: string } }) {
    // Si pasó el Guard, el token es válido. Devolvemos los datos del usuario.
    return { 
      ok: true, 
      user: req.user // o la info del usuario decodificada del token
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refrescar')
  refrescarToken(@Req() req: Request & { user: { userId: string; email: string; perfil: string } }) {
    // Llamas a tu AuthService para generar un nuevo token con el mismo payload
    return this.autenticacionService.refreshToken(req.user);
  }

  @Get()
  findAll() {
    return this.autenticacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autenticacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutenticacionDto: UpdateAutenticacionDto) {
    return this.autenticacionService.update(id, updateAutenticacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autenticacionService.remove(id);
  }
}

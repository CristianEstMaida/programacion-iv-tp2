import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service.js';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto.js';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

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

  @Post()
  create(@Body() createAutenticacionDto: CreateAutenticacionDto) {
    return this.autenticacionService.create(createAutenticacionDto);
  }

  @Get()
  findAll() {
    return this.autenticacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autenticacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutenticacionDto: UpdateAutenticacionDto) {
    return this.autenticacionService.update(+id, updateAutenticacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autenticacionService.remove(+id);
  }
}

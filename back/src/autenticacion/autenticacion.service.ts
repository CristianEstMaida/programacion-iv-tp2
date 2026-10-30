import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto.js';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto.js';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from '../usuarios/schemas/usuario.schema.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private jwtService: JwtService,
  ) {}

  async getPerfil(id: string) {
  // Buscamos por ID y excluimos el campo password para que nunca viaje
  const usuario = await this.usuarioModel.findById(id).select('-password');

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  return usuario;
}

  async login(loginDto: LoginDto) {
      const { identificador, password } = loginDto;
  
      // 1. Buscar al usuario por correo O por username (normalizado a minúsculas por seguridad)
      const identificadorLower = identificador.toLowerCase().trim();
      const usuario = await this.usuarioModel.findOne({
        $or: [
          { email: identificadorLower },
          { username: identificadorLower },
        ],
      });
  
      // 3. Rechazar credenciales incorrectas si no existe el usuario
      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
  
      // 2. Comprobar la contraseña con bcrypt.compare()
      const esPasswordValida = await bcrypt.compare(password, usuario.password);
      if (!esPasswordValida) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
  
      // 4. Comprobar que el usuario esté habilitado (activo: true)
      if (!usuario.activo) {
        throw new ForbiddenException('Tu cuenta se encuentra desactivada');
      }
  
      // 5. Generar un JWT con los datos mínimos necesarios (payload)
      const payload = {
        sub: usuario._id,
        identificador: usuario.email,
        perfil: usuario.perfil, // El rol del usuario
      };
  
      const token = this.jwtService.sign(payload);
  
      // 6. Devolver el token y los datos públicos del usuario (nunca la contraseña/hash)
      return {
        access_token: token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          username: usuario.username,
          fechaNacimiento: usuario.fechaNacimiento,
          descripcion: usuario.descripcion,
          imagenPerfil: usuario.imagenPerfil,
          perfil: usuario.perfil,
          activo: usuario.activo,
        },
      };
    }

  create(createAutenticacionDto: CreateAutenticacionDto) {
    return 'This action adds a new autenticacion';
  }

  findAll() {
    return `This action returns all autenticacion`;
  }

  async findOne(id: string) {
    const usuario = await this.usuarioModel.findById(id).select('-password');
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(id: string, updateAutenticacionDto: UpdateAutenticacionDto) {
    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateAutenticacionDto, { new: true })
      .select('-password');
      
    if (!usuarioActualizado) {
      throw new NotFoundException('Usuario no encontrado para actualizar');
    }
    return usuarioActualizado;
  }

  async remove(id: string) {
    const usuarioEliminado = await this.usuarioModel.findByIdAndDelete(id);
    if (!usuarioEliminado) {
      throw new NotFoundException('Usuario no encontrado para eliminar');
    }
    return { message: 'Usuario eliminado correctamente', id };
  }
}

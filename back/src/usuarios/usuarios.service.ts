import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema.js';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../autenticacion/dto/login.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>
  ) {}

  async registrar(createUsuarioDto: CreateUsuarioDto, imagenPath?: string): Promise<any> {
    try {
      const nuevoUsuario = new this.usuarioModel({
        ...createUsuarioDto,
        imagenPerfil: imagenPath ? `/uploads/${imagenPath}` : null,
        perfil: 'usuario', // Forzado por seguridad en el backend
        activo: true,
      });

      const usuarioGuardado = await nuevoUsuario.save();

      // Devolver solo los datos públicos (excluyendo password)
      return {
        id: usuarioGuardado._id,
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        email: usuarioGuardado.email,
        username: usuarioGuardado.username,
        fechaNacimiento: usuarioGuardado.fechaNacimiento,
        descripcion: usuarioGuardado.descripcion,
        imagenPerfil: usuarioGuardado.imagenPerfil,
        perfil: usuarioGuardado.perfil,
        activo: usuarioGuardado.activo,
      };
    } catch (error: unknown) {
      const err = error as { code?: number; keyPattern?: Record<string, any> };
      if (err.code === 11000) {
        const campo = Object.keys(err.keyPattern || {})[0] || 'campo';
        throw new ConflictException(`El ${campo} ya se encuentra registrado.`);
      }
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}

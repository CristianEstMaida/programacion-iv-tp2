import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    // 1. Validar que la contraseña y su repetición coincidan
    if (createUsuarioDto.password !== createUsuarioDto.repetirPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }
    
    try {
      const { repetirPassword, ...usuarioData } = createUsuarioDto;

      const nuevoUsuario = new this.usuarioModel({
        ...usuarioData,
        imagenPerfil: imagenPath ? `/uploads/${imagenPath}` : null,
        // Si no mandan perfil desde el front, por defecto será 'usuario'
        perfil: usuarioData.perfil || 'usuario',
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
      console.error('ERROR REAL EN BACKEND:', error);
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

  async findAll() {
    return await this.usuarioModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    const usuario = await this.usuarioModel.findById(id).select('-password');
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateUsuarioDto, { new: true })
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

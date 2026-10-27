var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schemas/usuario.schema.js';
import { Model } from 'mongoose';
let UsuariosService = class UsuariosService {
    usuarioModel;
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
    }
    async registrar(createUsuarioDto, imagenPath) {
        try {
            const nuevoUsuario = new this.usuarioModel({
                ...createUsuarioDto,
                imagenPerfil: imagenPath ? `/uploads/${imagenPath}` : null,
                perfil: 'usuario',
                activo: true,
            });
            const usuarioGuardado = await nuevoUsuario.save();
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
        }
        catch (error) {
            const err = error;
            if (err.code === 11000) {
                const campo = Object.keys(err.keyPattern || {})[0] || 'campo';
                throw new ConflictException(`El ${campo} ya se encuentra registrado.`);
            }
            throw new InternalServerErrorException('Error al registrar el usuario');
        }
    }
    create(createUsuarioDto) {
        return 'This action adds a new usuario';
    }
    findAll() {
        return `This action returns all usuarios`;
    }
    findOne(id) {
        return `This action returns a #${id} usuario`;
    }
    update(id, updateUsuarioDto) {
        return `This action updates a #${id} usuario`;
    }
    remove(id) {
        return `This action removes a #${id} usuario`;
    }
};
UsuariosService = __decorate([
    Injectable(),
    __param(0, InjectModel(Usuario.name)),
    __metadata("design:paramtypes", [Model])
], UsuariosService);
export { UsuariosService };
//# sourceMappingURL=usuarios.service.js.map
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
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../usuarios/schemas/usuario.schema.js';
import { JwtService } from '@nestjs/jwt';
let AutenticacionService = class AutenticacionService {
    usuarioModel;
    jwtService;
    constructor(usuarioModel, jwtService) {
        this.usuarioModel = usuarioModel;
        this.jwtService = jwtService;
    }
    async getPerfil(id) {
        const usuario = await this.usuarioModel.findById(id).select('-password');
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return usuario;
    }
    async login(loginDto) {
        const { identificador, password } = loginDto;
        const identificadorLower = identificador.toLowerCase().trim();
        const usuario = await this.usuarioModel.findOne({
            $or: [
                { email: identificadorLower },
                { username: identificadorLower },
            ],
        });
        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const esPasswordValida = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        if (!usuario.activo) {
            throw new ForbiddenException('Tu cuenta se encuentra desactivada');
        }
        const payload = {
            sub: usuario._id,
            identificador: usuario.email,
            perfil: usuario.perfil,
        };
        const token = this.jwtService.sign(payload);
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
    create(createAutenticacionDto) {
        return 'This action adds a new autenticacion';
    }
    findAll() {
        return `This action returns all autenticacion`;
    }
    findOne(id) {
        return `This action returns a #${id} autenticacion`;
    }
    update(id, updateAutenticacionDto) {
        return `This action updates a #${id} autenticacion`;
    }
    remove(id) {
        return `This action removes a #${id} autenticacion`;
    }
};
AutenticacionService = __decorate([
    Injectable(),
    __param(0, InjectModel(Usuario.name)),
    __metadata("design:paramtypes", [Model,
        JwtService])
], AutenticacionService);
export { AutenticacionService };
//# sourceMappingURL=autenticacion.service.js.map
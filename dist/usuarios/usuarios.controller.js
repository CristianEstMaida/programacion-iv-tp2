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
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
let UsuariosController = class UsuariosController {
    usuariosService;
    cloudinaryService;
    constructor(usuariosService, cloudinaryService) {
        this.usuariosService = usuariosService;
        this.cloudinaryService = cloudinaryService;
    }
    async registrar(createUsuarioDto, file) {
        let imagenUrl = undefined;
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file);
            imagenUrl = uploadResult.secure_url;
        }
        return await this.usuariosService.registrar(createUsuarioDto, imagenUrl);
    }
    findAll() {
        return this.usuariosService.findAll();
    }
    findOne(id) {
        return this.usuariosService.findOne(+id);
    }
    update(id, updateUsuarioDto) {
        return this.usuariosService.update(+id, updateUsuarioDto);
    }
    remove(id) {
        return this.usuariosService.remove(+id);
    }
};
__decorate([
    Post('registro'),
    HttpCode(HttpStatus.CREATED),
    UseInterceptors(FileInterceptor('imagenPerfil', {
        limits: { fileSize: 2 * 1024 * 1024 },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, webp)'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, Body()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUsuarioDto, Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "registrar", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "remove", null);
UsuariosController = __decorate([
    Controller('autenticacion'),
    __metadata("design:paramtypes", [UsuariosService,
        CloudinaryService])
], UsuariosController);
export { UsuariosController };
//# sourceMappingURL=usuarios.controller.js.map
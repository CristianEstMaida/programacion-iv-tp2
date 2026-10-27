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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
let PublicacionesController = class PublicacionesController {
    publicacionesService;
    constructor(publicacionesService) {
        this.publicacionesService = publicacionesService;
    }
    create(createPublicacioneDto) {
        return this.publicacionesService.create(createPublicacioneDto);
    }
    findAll() {
        return this.publicacionesService.findAll();
    }
    findOne(id) {
        return this.publicacionesService.findOne(+id);
    }
    update(id, updatePublicacioneDto) {
        return this.publicacionesService.update(+id, updatePublicacioneDto);
    }
    remove(id) {
        return this.publicacionesService.remove(+id);
    }
};
__decorate([
    UseGuards(JwtAuthGuard),
    Get('mi-perfil-o-recurso-privado'),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePublicacioneDto]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePublicacioneDto]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "remove", null);
PublicacionesController = __decorate([
    Controller('publicaciones'),
    __metadata("design:paramtypes", [PublicacionesService])
], PublicacionesController);
export { PublicacionesController };
//# sourceMappingURL=publicaciones.controller.js.map
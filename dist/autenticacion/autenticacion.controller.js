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
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service.js';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto.js';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard.js';
let AutenticacionController = class AutenticacionController {
    autenticacionService;
    constructor(autenticacionService) {
        this.autenticacionService = autenticacionService;
    }
    async obtenerPerfilPropio(req) {
        const userId = req.user.userId;
        return await this.autenticacionService.getPerfil(userId);
    }
    async login(loginDto) {
        return await this.autenticacionService.login(loginDto);
    }
    create(createAutenticacionDto) {
        return this.autenticacionService.create(createAutenticacionDto);
    }
    findAll() {
        return this.autenticacionService.findAll();
    }
    findOne(id) {
        return this.autenticacionService.findOne(+id);
    }
    update(id, updateAutenticacionDto) {
        return this.autenticacionService.update(+id, updateAutenticacionDto);
    }
    remove(id) {
        return this.autenticacionService.remove(+id);
    }
};
__decorate([
    UseGuards(JwtAuthGuard),
    Get('perfil'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutenticacionController.prototype, "obtenerPerfilPropio", null);
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AutenticacionController.prototype, "login", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAutenticacionDto]),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAutenticacionDto]),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "remove", null);
AutenticacionController = __decorate([
    Controller('autenticacion'),
    __metadata("design:paramtypes", [AutenticacionService])
], AutenticacionController);
export { AutenticacionController };
//# sourceMappingURL=autenticacion.controller.js.map
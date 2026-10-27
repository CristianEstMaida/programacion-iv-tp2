var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service.js';
import { AutenticacionController } from './autenticacion.controller.js';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema.js';
let AutenticacionModule = class AutenticacionModule {
};
AutenticacionModule = __decorate([
    Module({
        imports: [
            PassportModule,
            MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
            JwtModule.register({
                secret: 'SUPER_SECRETO_CAMBIAR_EN_PRODUCCION',
                signOptions: { expiresIn: '2h' },
            }),
        ],
        controllers: [AutenticacionController],
        providers: [AutenticacionService],
    })
], AutenticacionModule);
export { AutenticacionModule };
//# sourceMappingURL=autenticacion.module.js.map
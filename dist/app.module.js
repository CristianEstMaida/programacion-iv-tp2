var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AutenticacionModule } from './autenticacion/autenticacion.module.js';
import { PublicacionesModule } from './publicaciones/publicaciones.module.js';
import { CloudinaryService } from './cloudinary/cloudinary.service.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [UsuariosModule, AutenticacionModule, PublicacionesModule,
            ConfigModule.forRoot({
                isGlobal: true,
            }),
            MongooseModule.forRootAsync({
                inject: [ConfigService],
                useFactory: (config) => ({
                    uri: config.getOrThrow('MONGODB_URI'),
                }),
            }),
        ],
        controllers: [AppController],
        providers: [AppService, CloudinaryService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map
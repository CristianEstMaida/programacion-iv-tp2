import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service.js';
import { AutenticacionController } from './autenticacion.controller.js';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema.js';
import { JwtStrategy } from './jwt.strategy.js';

@Module({
  imports: [
    PassportModule, // <--- Importante
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    JwtModule.register({
      secret: 'MI_CLAVE_SECRETA_SUPER_SEGURA',
      // signOptions: { expiresIn: '15m' },
      signOptions: { expiresIn: '20s' },
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AutenticacionModule {}

import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { UsuariosController } from './usuarios.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Module({
  imports: [
    // 👈 ESTO ES LO QUE FALTA: Registrar el modelo para que el servicio pueda inyectarlo
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema }
    ])
  ],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    CloudinaryService
  ],
  exports: [UsuariosService],
})
export class UsuariosModule {}

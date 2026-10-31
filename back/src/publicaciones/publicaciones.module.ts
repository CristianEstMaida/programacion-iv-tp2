import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { PublicacionesService } from './publicaciones.service.js';
import { PublicacionesController } from './publicaciones.controller.js';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema.js'; // 👈 2. Importar tu esquema
import { AutenticacionModule } from '../autenticacion/autenticacion.module.js';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema.js';

@Module({
  imports: [
    // 3. Registrar el esquema para que funcione el @InjectModel en el servicio
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
      { name: Usuario.name, schema: UsuarioSchema }
    ]),
    AutenticacionModule,
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
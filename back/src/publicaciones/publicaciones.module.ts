import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { PublicacionesService } from './publicaciones.service.js';
import { PublicacionesController } from './publicaciones.controller.js';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema.js'; // 👈 2. Importar tu esquema
import { AutenticacionModule } from '../autenticacion/autenticacion.module.js';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { ComentariosController } from './comentarios.controller.js'; // Asegúrate de que la ruta sea correcta
import { ComentariosService } from './comentarios.service.js'; // Asegúrate de que la ruta sea correcta
import { Comentario, ComentarioSchema } from './schemas/comentario.schema.js';
import { EstadisticasController } from './estadisticas.controller.js';

@Module({
  imports: [
    // 3. Registrar el esquema para que funcione el @InjectModel en el servicio
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
      { name: Publicacion.name, schema: PublicacionSchema },
      { name: Usuario.name, schema: UsuarioSchema }
    ]),
    AutenticacionModule,
  ],
  controllers: [PublicacionesController, ComentariosController, EstadisticasController], // Asegúrate de que ComentariosController y EstadisticasController estén importados
  providers: [PublicacionesService, CloudinaryService, ComentariosService], // Asegúrate de que CloudinaryService y ComentariosService estén importados y registrados
})
export class PublicacionesModule {}
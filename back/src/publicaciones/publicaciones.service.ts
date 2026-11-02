import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema.js'; // Ajusta la ruta a tu esquema si es necesario

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private publicacionModel: Model<PublicacionDocument>,
  ) {}

  // 1. CREAR: Guarda la publicación asociada al usuario logueado
  async create(createPublicacioneDto: CreatePublicacioneDto, userId: string) {
    const nuevaPublicacion = new this.publicacionModel({
      ...createPublicacioneDto,
      usuario: userId,
      activo: true,
      likes: [],
    });
    return await nuevaPublicacion.save();
  }

  // 2. LISTAR: Permite filtrar por usuario, ordenar por fecha o cantidad de likes, y paginar
  async findAll(params?: { usuarioId?: string; orden?: 'fecha' | 'likes'; limit?: number; offset?: number }) {
    const filtro: any = { activo: true }; // Solo publicaciones activas (baja lógica)

    if (params?.usuarioId) {
      filtro.usuario = params.usuarioId;
    }

    // Definir el criterio de ordenamiento
    let ordenQuery: any = { createdAt: -1 }; // Por defecto por fecha descendente
    if (params?.orden === 'likes') {
      ordenQuery = { 'likesCount': -1 }; // Asumiendo campo calculado o se puede ordenar por tamaño de array
    }

    const limit = params?.limit ?? 10;
    const offset = params?.offset ?? 0;

    // Si ordenamos por likes en Mongoose, podemos usar el tamaño del array o un campo contador. 
    // Aquí ordenamos directamente por la longitud del array de likes si está estructurado así, o por fecha.
    return await this.publicacionModel
      .find(filtro)
      .sort(ordenQuery)
      .skip(offset)
      .limit(limit)
      .populate('usuario', 'nombre apellido imagenPerfil') // Opcional: trae datos básicos del usuario
      .exec();
  }

  async findOne(id: string) {
    const pub = await this.publicacionModel.findById(id).exec();
    if (!pub || !pub.activo) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    return pub;
  }

  async update(id: string, updatePublicacioneDto: UpdatePublicacioneDto) {
    return await this.publicacionModel.findByIdAndUpdate(id, updatePublicacioneDto, { new: true }).exec();
  }

  // 3. BAJA LÓGICA: Solo realizada por el usuario creador o un administrador
  async softDelete(id: string, usuarioLogueado: any) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) {
      throw new NotFoundException(`Publicación #${id} no encontrada`);
    }

    // Extraer el ID del usuario logueado de forma segura (puede venir en 'sub' o en 'id')
    const usuarioIdLogueado = usuarioLogueado.sub || usuarioLogueado.id;

    // Validar si es el dueño
    const esDueño = publicacion.usuario.toString() === usuarioIdLogueado.toString();

    // Validar si es admin (revisando tanto 'rol' como 'perfil', y permitiendo 'admin' o 'administrador')
    const rolUsuario = usuarioLogueado.rol || usuarioLogueado.perfil;
    const esAdmin = rolUsuario === 'admin' || rolUsuario === 'administrador';

    if (!esDueño && !esAdmin) {
      throw new ForbiddenException('No tienes permisos para eliminar esta publicación');
    }

    publicacion.activo = false;
    return await publicacion.save();
  }

  // 4. DAR LIKE: Un usuario solo puede dar un me gusta (usamos $addToSet para evitar duplicados)
  async darLike(id: string, userId: string) {
    // 1. Buscamos la publicación asegurándonos de que EXISTA y esté ACTIVA
    const publicacionActual = await this.publicacionModel.findOne({ 
      _id: id, 
      activo: true 
    }).exec();
    
    if (!publicacionActual) {
      throw new NotFoundException(`Publicación #${id} no encontrada o inactiva`);
    }

    // 2. Verificamos si el userId ya está en el array de likes
    const yaDioLike = publicacionActual.likes.some(
      (uid) => String(uid) === String(userId)
    );

    // Si ya dio like, no hacemos nada o retornamos la publicación sin modificar
    if (yaDioLike) {
      return publicacionActual; 
    }

    // 3. Si no dio like, usamos $addToSet y $inc de forma segura
    const publicacionActualizada = await this.publicacionModel.findByIdAndUpdate(
      id,
      { 
        $addToSet: { likes: userId }, // Garantiza que el ID nunca se repita en el array
        $inc: { likesCount: 1 }      // Solo incrementa una vez
      },
      { new: true }
    ).exec();

    return publicacionActualizada;
  }

  // 5. QUITAR LIKE: Elimina el like del usuario si previamente lo había hecho ($pull)
  async quitarLike(id: string, userId: string) {
    const publicacion = await this.publicacionModel.findByIdAndUpdate(
      id,
      { 
        $pull: { likes: userId },
        $inc: { likesCount: -1 } 
      }, // Remueve el ID del array de likes
      
      { new: true }
    ).exec();

    if (!publicacion) {
      throw new NotFoundException(`Publicación #${id} no encontrada`);
    }

    return publicacion;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario } from './schemas/comentario.schema.js'; // O tu entidad/modelo correspondiente

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
  ) {}

  // 1. POST: Agregar un comentario a una publicación junto con el usuario y la fecha
  async crear(publicacionId: string, usuarioId: string, mensaje: string) {
    const nuevoComentario = new this.comentarioModel({
      publicacion: publicacionId,
      usuario: usuarioId,
      mensaje,
      fecha: new Date(), // Asigna la fecha actual
      modificado: false, // Arranca como falso al crearse
    });
    return await nuevoComentario.save();
  }

  // 2. GET: Traer comentarios de una publicación específica, paginados y ordenados (más recientes primero)
  async obtenerPorPublicacion(publicacionId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const comentarios = await this.comentarioModel
      .find({ publicacion: publicacionId })
      .sort({ fecha: -1 }) // 👈 Ordena por los más recientes primero (-1 descendente)
      .skip(skip)
      .limit(limit)
      .populate('usuario', 'nombre apellido') // Opcional: para traer datos del usuario si lo necesitas
      .exec();

    const total = await this.comentarioModel.countDocuments({ publicacion: publicacionId });

    return {
      data: comentarios,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  // 3. PUT: Modifica el mensaje y agrega el atributo modificado: true
  async actualizar(comentarioId: string, mensaje: string) {
    const comentarioActualizado = await this.comentarioModel.findByIdAndUpdate(
      comentarioId,
      {
        mensaje,
        modificado: true, // Requerimiento obligatorio de la consigna
      },
      { new: true }, // Retorna el documento ya actualizado
    );

    if (!comentarioActualizado) {
      throw new NotFoundException('Comentario no encontrado');
    }

    return comentarioActualizado;
  }
}
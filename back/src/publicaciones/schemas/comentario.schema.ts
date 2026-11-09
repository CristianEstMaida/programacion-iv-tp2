import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// 1. Declarar el tipo ComentarioDocument
export type ComentarioDocument = Comentario & Document;

@Schema({ timestamps: true }) // timestamps crea automáticamente createdAt y updatedAt si los necesitas
export class Comentario {
  @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
  publicacion: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true }) // Cambia 'User' por el nombre de tu modelo de usuario
  usuario: Types.ObjectId;

  @Prop({ required: true, trim: true })
  mensaje: string;

  @Prop({ default: Date.now })
  fecha: Date;

  @Prop({ default: false })
  modificado: boolean; //  Requerimiento clave de la consigna para el PUT
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
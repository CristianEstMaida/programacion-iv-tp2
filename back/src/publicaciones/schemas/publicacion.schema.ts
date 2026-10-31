import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PublicacionDocument = Publicacion & Document;

@Schema({ timestamps: true }) // Añade automáticamente createdAt y updatedAt
export class Publicacion {
  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, trim: true })
  descripcion: string;

  @Prop({ trim: true })
  imagenUrl?: string;

  // Relación con el modelo de Usuario
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario: Types.ObjectId;

  @Prop({ default: true })
  activo: boolean; // Para la baja lógica

  // Array que almacena los IDs de los usuarios que dieron "me gusta"
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
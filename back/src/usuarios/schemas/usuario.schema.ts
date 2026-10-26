import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fechaNacimiento: Date;

  @Prop({ trim: true })
  descripcion: string;

  @Prop({ trim: true })
  imagenPerfil: string;

  @Prop({ required: true, enum: ['usuario', 'administrador'], default: 'usuario' })
  perfil: string;

  @Prop({ default: true })
  activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Middleware para hashear la contraseña antes de guardar
UsuarioSchema.pre('save', async function () {
  const usuario = this as any;
  
  // Si la contraseña no ha sido modificada, no la volvemos a hashear
  if (!usuario.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
  } catch (error) {
    throw error;
  }
});
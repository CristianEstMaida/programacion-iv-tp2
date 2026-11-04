import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePublicacioneDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  descripcion: string;

  // La imagen la manejamos opcionalmente por si acaso, 
  // ya que la procesa Cloudinary y se inyecta la URL después en el controlador
  @IsOptional()
  @IsString()
  imagen?: string;
}
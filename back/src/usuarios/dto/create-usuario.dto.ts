import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional, Matches, MinLength, IsIn } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string;

  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El username es obligatorio' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una letra mayúscula y un número',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe repetir la contraseña' })
  repetirPassword: string;

  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido' })
  @IsNotEmpty()
  fechaNacimiento: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  // La imagen vendrá como archivo de Multer, por lo que no siempre viaja en el DTO de texto.
  @IsString()
  @IsOptional()
  imagenPerfil?: string;

  @IsString()
  @IsOptional() // O @IsNotEmpty() si el parcial exige que sea obligatorio elegirlo
  @IsIn(['usuario', 'administrador'], { message: 'Perfil no válido' }) // Opcional: restringe los roles permitidos
  perfil?: string;
}
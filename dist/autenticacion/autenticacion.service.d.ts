import { CreateAutenticacionDto } from './dto/create-autenticacion.dto.js';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from '../usuarios/schemas/usuario.schema.js';
import { JwtService } from '@nestjs/jwt';
export declare class AutenticacionService {
    private usuarioModel;
    private jwtService;
    constructor(usuarioModel: Model<UsuarioDocument>, jwtService: JwtService);
    getPerfil(id: string): Promise<import("mongoose").Document<unknown, {}, UsuarioDocument, {}, import("mongoose").DefaultSchemaOptions> & Usuario & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: import("mongoose").Types.ObjectId;
            nombre: string;
            apellido: string;
            email: string;
            username: string;
            fechaNacimiento: Date;
            descripcion: string;
            imagenPerfil: string;
            perfil: string;
            activo: true;
        };
    }>;
    create(createAutenticacionDto: CreateAutenticacionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAutenticacionDto: UpdateAutenticacionDto): string;
    remove(id: number): string;
}

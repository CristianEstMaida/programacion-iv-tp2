import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { UsuarioDocument } from './schemas/usuario.schema.js';
import { Model } from 'mongoose';
export declare class UsuariosService {
    private usuarioModel;
    constructor(usuarioModel: Model<UsuarioDocument>);
    registrar(createUsuarioDto: CreateUsuarioDto, imagenPath?: string): Promise<any>;
    create(createUsuarioDto: CreateUsuarioDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto): string;
    remove(id: number): string;
}

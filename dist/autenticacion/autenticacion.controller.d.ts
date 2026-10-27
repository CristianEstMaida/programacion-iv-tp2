import { AutenticacionService } from './autenticacion.service.js';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto.js';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AutenticacionController {
    private readonly autenticacionService;
    constructor(autenticacionService: AutenticacionService);
    obtenerPerfilPropio(req: Request & {
        user: {
            userId: string;
            email: string;
            perfil: string;
        };
    }): Promise<import("mongoose").Document<unknown, {}, import("../usuarios/schemas/usuario.schema.js").UsuarioDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../usuarios/schemas/usuario.schema.js").Usuario & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string): string;
    update(id: string, updateAutenticacionDto: UpdateAutenticacionDto): string;
    remove(id: string): string;
}

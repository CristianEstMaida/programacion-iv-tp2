import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
export declare class UsuariosController {
    private readonly usuariosService;
    private readonly cloudinaryService;
    constructor(usuariosService: UsuariosService, cloudinaryService: CloudinaryService);
    registrar(createUsuarioDto: CreateUsuarioDto, file?: Express.Multer.File): Promise<any>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUsuarioDto: UpdateUsuarioDto): string;
    remove(id: string): string;
}

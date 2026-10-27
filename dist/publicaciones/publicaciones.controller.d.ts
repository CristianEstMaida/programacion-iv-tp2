import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
export declare class PublicacionesController {
    private readonly publicacionesService;
    constructor(publicacionesService: PublicacionesService);
    create(createPublicacioneDto: CreatePublicacioneDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePublicacioneDto: UpdatePublicacioneDto): string;
    remove(id: string): string;
}

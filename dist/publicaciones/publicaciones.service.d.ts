import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
export declare class PublicacionesService {
    create(createPublicacioneDto: CreatePublicacioneDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePublicacioneDto: UpdatePublicacioneDto): string;
    remove(id: number): string;
}

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let PublicacionesService = class PublicacionesService {
    create(createPublicacioneDto) {
        return 'This action adds a new publicacione';
    }
    findAll() {
        return `This action returns all publicaciones`;
    }
    findOne(id) {
        return `This action returns a #${id} publicacione`;
    }
    update(id, updatePublicacioneDto) {
        return `This action updates a #${id} publicacione`;
    }
    remove(id) {
        return `This action removes a #${id} publicacione`;
    }
};
PublicacionesService = __decorate([
    Injectable()
], PublicacionesService);
export { PublicacionesService };
//# sourceMappingURL=publicaciones.service.js.map
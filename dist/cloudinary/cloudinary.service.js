var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream({ folder: 'pulsenet_profiles' }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error('Error al subir la imagen a Cloudinary'));
                resolve(result);
            });
            Readable.from(file.buffer).pipe(upload);
        });
    }
};
CloudinaryService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
export { CloudinaryService };
//# sourceMappingURL=cloudinary.service.js.map
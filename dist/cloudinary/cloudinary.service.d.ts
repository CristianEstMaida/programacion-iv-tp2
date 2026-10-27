import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
export declare class CloudinaryService {
    constructor();
    uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse>;
}

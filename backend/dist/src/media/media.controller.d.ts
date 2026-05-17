import { MediaService } from './media.service';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
    };
}
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(businessId: string): Promise<({
        uploadedBy: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        uploadedById: string;
    })[]>;
    uploadFile(req: RequestWithUser, businessId: string, file: any): Promise<{
        uploadedBy: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        uploadedById: string;
    }>;
    remove(businessId: string, mediaId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        uploadedById: string;
    }>;
}
export {};

import { PrismaService } from '../prisma.service';
export declare class MediaService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
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
    create(businessId: string, userId: string, file: {
        filename: string;
        originalname: string;
        mimetype: string;
        size: number;
    }): Promise<{
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

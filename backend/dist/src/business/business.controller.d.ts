import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
interface RequestWithUser {
    user: {
        id: string;
        email: string;
    };
}
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(req: RequestWithUser, dto: CreateBusinessDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
    findAll(req: RequestWithUser): Promise<({
        BusinessUser: {
            role: import("@prisma/client").$Enums.Role;
        }[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    })[]>;
    findOne(req: RequestWithUser, id: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
    update(req: RequestWithUser, id: string, dto: UpdateBusinessDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
    remove(req: RequestWithUser, id: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
}
export {};

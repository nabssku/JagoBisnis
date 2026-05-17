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
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        phone: string | null;
        address: string | null;
    }>;
    findAll(req: RequestWithUser): Promise<({
        BusinessUser: {
            role: import("@prisma/client").$Enums.Role;
        }[];
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        phone: string | null;
        address: string | null;
    })[]>;
    findOne(req: RequestWithUser, id: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        phone: string | null;
        address: string | null;
    }>;
    update(req: RequestWithUser, id: string, dto: UpdateBusinessDto): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        phone: string | null;
        address: string | null;
    }>;
    remove(req: RequestWithUser, id: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        phone: string | null;
        address: string | null;
    }>;
}
export {};

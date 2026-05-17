import { PrismaService } from '../prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
        description: string | null;
        name: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
    findAll(userId: string): Promise<({
        BusinessUser: {
            role: import("@prisma/client").$Enums.Role;
        }[];
    } & {
        description: string | null;
        name: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    })[]>;
    findOne(userId: string, id: string): Promise<{
        description: string | null;
        name: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateBusinessDto): Promise<{
        description: string | null;
        name: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        description: string | null;
        name: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        category: string | null;
        address: string | null;
    }>;
    private checkPermission;
    private generateSlug;
}

import { PrismaService } from '../prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
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
    findAll(userId: string): Promise<({
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
    findOne(userId: string, id: string): Promise<{
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
    update(userId: string, id: string, dto: UpdateBusinessDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
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
    private checkPermission;
    private generateSlug;
}

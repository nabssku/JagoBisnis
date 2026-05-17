import { PrismaService } from '../prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
export declare class SiteService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly defaultTheme;
    private readonly defaultSections;
    getByBusinessId(businessId: string, userId: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    create(businessId: string, userId: string, dto: CreateSiteDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    update(businessId: string, userId: string, dto: UpdateSiteDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    updateTheme(businessId: string, userId: string, theme: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    updateSections(businessId: string, userId: string, sections: any[]): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    publish(businessId: string, userId: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    unpublish(businessId: string, userId: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    getPublicSite(slug: string): Promise<{
        business: {
            Product: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                category: string | null;
                businessId: string;
                price: number;
                stock: number;
                imageUrl: string | null;
                images: string[];
                isActive: boolean;
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
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    private checkMembership;
    private checkPermission;
}

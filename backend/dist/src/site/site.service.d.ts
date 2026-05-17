import { PrismaService } from '../prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
export declare class SiteService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly defaultTheme;
    private readonly defaultSections;
    getByBusinessId(businessId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    create(businessId: string, userId: string, dto: CreateSiteDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    update(businessId: string, userId: string, dto: UpdateSiteDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    updateTheme(businessId: string, userId: string, theme: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    updateSections(businessId: string, userId: string, sections: any[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    publish(businessId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    unpublish(businessId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        businessId: string;
        theme: import("@prisma/client/runtime/library").JsonValue;
        sections: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    getPublicSite(slug: string): Promise<{
        integrations: {
            pakasir: {
                connected: boolean;
            };
            googleAnalytics: {
                measurementId: any;
            };
        };
        business: {
            Product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
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
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
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

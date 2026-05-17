import { SiteService } from './site.service';
export declare class PublicSiteController {
    private readonly siteService;
    constructor(siteService: SiteService);
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
}

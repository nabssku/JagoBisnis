import { SiteService } from './site.service';
export declare class PublicSiteController {
    private readonly siteService;
    constructor(siteService: SiteService);
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
}

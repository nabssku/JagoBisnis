import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { UpdateSiteThemeDto } from './dto/update-site-theme.dto';
import { UpdateSiteSectionsDto } from './dto/update-site-sections.dto';
interface RequestWithUser {
    user: {
        id: string;
        email: string;
    };
}
export declare class SiteController {
    private readonly siteService;
    constructor(siteService: SiteService);
    getSite(businessId: string, req: RequestWithUser): Promise<{
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
    createSite(businessId: string, dto: CreateSiteDto, req: RequestWithUser): Promise<{
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
    updateSite(businessId: string, dto: UpdateSiteDto, req: RequestWithUser): Promise<{
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
    updateTheme(businessId: string, dto: UpdateSiteThemeDto, req: RequestWithUser): Promise<{
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
    updateSections(businessId: string, dto: UpdateSiteSectionsDto, req: RequestWithUser): Promise<{
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
    publish(businessId: string, req: RequestWithUser): Promise<{
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
    unpublish(businessId: string, req: RequestWithUser): Promise<{
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
export {};

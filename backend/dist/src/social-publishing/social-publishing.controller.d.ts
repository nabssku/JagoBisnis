import { SocialPublishingService } from './social-publishing.service';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
interface RequestWithUser {
    user: {
        id: string;
        email: string;
    };
}
export declare class SocialPublishingController {
    private readonly publishingService;
    constructor(publishingService: SocialPublishingService);
    create(req: RequestWithUser, businessId: string, dto: CreateSocialPostDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        businessId: string;
        publishedAt: Date | null;
        provider: import("@prisma/client").$Enums.SocialPostProvider;
        status: import("@prisma/client").$Enums.SocialPostStatus;
        mediaType: import("@prisma/client").$Enums.MediaType;
        mediaUrls: import("@prisma/client/runtime/library").JsonValue | null;
        providerPostId: string | null;
        errorMessage: string | null;
        integrationId: string;
    }>;
    findAll(req: RequestWithUser, businessId: string): Promise<({
        integration: {
            providerAccountId: string | null;
            providerAccountName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        businessId: string;
        publishedAt: Date | null;
        provider: import("@prisma/client").$Enums.SocialPostProvider;
        status: import("@prisma/client").$Enums.SocialPostStatus;
        mediaType: import("@prisma/client").$Enums.MediaType;
        mediaUrls: import("@prisma/client/runtime/library").JsonValue | null;
        providerPostId: string | null;
        errorMessage: string | null;
        integrationId: string;
    })[]>;
    findOne(req: RequestWithUser, businessId: string, postId: string): Promise<{
        integration: {
            providerAccountId: string | null;
            providerAccountName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        businessId: string;
        publishedAt: Date | null;
        provider: import("@prisma/client").$Enums.SocialPostProvider;
        status: import("@prisma/client").$Enums.SocialPostStatus;
        mediaType: import("@prisma/client").$Enums.MediaType;
        mediaUrls: import("@prisma/client/runtime/library").JsonValue | null;
        providerPostId: string | null;
        errorMessage: string | null;
        integrationId: string;
    }>;
    remove(req: RequestWithUser, businessId: string, postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        businessId: string;
        publishedAt: Date | null;
        provider: import("@prisma/client").$Enums.SocialPostProvider;
        status: import("@prisma/client").$Enums.SocialPostStatus;
        mediaType: import("@prisma/client").$Enums.MediaType;
        mediaUrls: import("@prisma/client/runtime/library").JsonValue | null;
        providerPostId: string | null;
        errorMessage: string | null;
        integrationId: string;
    }>;
    publish(req: RequestWithUser, businessId: string, postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        businessId: string;
        publishedAt: Date | null;
        provider: import("@prisma/client").$Enums.SocialPostProvider;
        status: import("@prisma/client").$Enums.SocialPostStatus;
        mediaType: import("@prisma/client").$Enums.MediaType;
        mediaUrls: import("@prisma/client/runtime/library").JsonValue | null;
        providerPostId: string | null;
        errorMessage: string | null;
        integrationId: string;
    }>;
}
export {};

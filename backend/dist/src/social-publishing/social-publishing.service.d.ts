import { PrismaService } from '../prisma.service';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
import { InstagramProvider } from '../integration/providers/instagram.provider';
import { ThreadsProvider } from '../integration/providers/threads.provider';
export declare class SocialPublishingService {
    private prisma;
    private instagramProvider;
    private threadsProvider;
    constructor(prisma: PrismaService, instagramProvider: InstagramProvider, threadsProvider: ThreadsProvider);
    create(userId: string, businessId: string, dto: CreateSocialPostDto): Promise<{
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
    findAll(userId: string, businessId: string): Promise<({
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
    findOne(userId: string, businessId: string, id: string): Promise<{
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
    remove(userId: string, businessId: string, id: string): Promise<{
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
    publish(userId: string, businessId: string, id: string): Promise<{
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
    private validateSocialRules;
    private mapToIntegrationProvider;
    private checkAccess;
    private checkPermission;
}

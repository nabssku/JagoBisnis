import { SocialPostProvider, MediaType } from '@prisma/client';
export declare class CreateSocialPostDto {
    provider: SocialPostProvider;
    content: string;
    mediaType?: MediaType;
    mediaUrls?: string[];
}

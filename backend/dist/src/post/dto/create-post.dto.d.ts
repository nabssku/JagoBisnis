export declare class CreatePostDto {
    title: string;
    slug: string;
    coverImage?: string;
    images?: string[];
    focusKeyword?: string;
    metaTitle?: string;
    metaDescription?: string;
    content: string;
    summary?: string;
    ctaType?: string;
    ctaValue?: string;
    imageAlt?: string;
    contentType?: string;
    status?: string;
    isPinned?: boolean;
    tags?: string[];
    relatedProductIds?: string[];
}

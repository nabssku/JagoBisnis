export declare class CreateProductDto {
    name: string;
    slug?: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    images?: string[];
    category?: string;
    isActive?: boolean;
}

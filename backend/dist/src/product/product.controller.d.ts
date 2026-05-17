import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
interface RequestWithUser {
    user: {
        id: string;
        email: string;
    };
}
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    uploadFile(file: any): {
        url: string;
    };
    getMedia(): {
        name: string;
        url: string;
    }[];
    create(req: RequestWithUser, businessId: string, dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        images: string[];
        category: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    findAll(req: RequestWithUser, businessId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        images: string[];
        category: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }[]>;
    findOne(req: RequestWithUser, businessId: string, productId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        images: string[];
        category: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    update(req: RequestWithUser, businessId: string, productId: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        images: string[];
        category: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    remove(req: RequestWithUser, businessId: string, productId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        images: string[];
        category: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
}
export {};

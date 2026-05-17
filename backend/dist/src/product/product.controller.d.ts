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
    uploadFile(businessId: string, req: any, file: any): Promise<{
        url: string;
    }>;
    getMedia(): {
        name: string;
        url: string;
    }[];
    create(req: RequestWithUser, businessId: string, dto: CreateProductDto): Promise<{
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
    }>;
    findAll(req: RequestWithUser, businessId: string): Promise<{
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
    }[]>;
    findOne(req: RequestWithUser, businessId: string, productId: string): Promise<{
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
    }>;
    update(req: RequestWithUser, businessId: string, productId: string, dto: UpdateProductDto): Promise<{
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
    }>;
    remove(req: RequestWithUser, businessId: string, productId: string): Promise<{
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
    }>;
}
export {};

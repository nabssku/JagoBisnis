import { OrderService } from './order.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
interface RequestWithUser {
    user: {
        id: string;
        email: string;
    };
}
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createPublicOrder(slug: string, dto: CreatePublicOrderDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        productId: string;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        quantity: number;
        paymentMethod: string;
        notes: string | null;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        productNameSnapshot: string;
        productPriceSnapshot: number;
        subtotal: number;
        pakasirOrderId: string | null;
        pakasirPaymentUrl: string | null;
        pakasirPaymentMethod: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getPublicOrderStatus(orderId: string): Promise<{
        id: string;
        customerName: string;
        customerPhone: string;
        customerAddress: string | null;
        productName: string;
        productPrice: number;
        quantity: number;
        subtotal: number;
        paymentMethod: string;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        pakasirPaymentUrl: string | null;
        notes: string | null;
        businessName: string;
        siteSlug: string;
        createdAt: Date;
    }>;
    getBusinessOrders(businessId: string, req: RequestWithUser): Promise<({
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        productId: string;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        quantity: number;
        paymentMethod: string;
        notes: string | null;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        productNameSnapshot: string;
        productPriceSnapshot: number;
        subtotal: number;
        pakasirOrderId: string | null;
        pakasirPaymentUrl: string | null;
        pakasirPaymentMethod: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getBusinessOrderDetail(businessId: string, orderId: string, req: RequestWithUser): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        productId: string;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        quantity: number;
        paymentMethod: string;
        notes: string | null;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        productNameSnapshot: string;
        productPriceSnapshot: number;
        subtotal: number;
        pakasirOrderId: string | null;
        pakasirPaymentUrl: string | null;
        pakasirPaymentMethod: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateBusinessOrderStatus(businessId: string, orderId: string, req: RequestWithUser, dto: UpdateOrderStatusDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        productId: string;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        quantity: number;
        paymentMethod: string;
        notes: string | null;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        productNameSnapshot: string;
        productPriceSnapshot: number;
        subtotal: number;
        pakasirOrderId: string | null;
        pakasirPaymentUrl: string | null;
        pakasirPaymentMethod: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
export {};

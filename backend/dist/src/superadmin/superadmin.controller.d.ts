import { SuperAdminService } from './superadmin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class SuperAdminController {
    private readonly service;
    constructor(service: SuperAdminService);
    getStats(): Promise<{
        totalUsers: number;
        totalBusinesses: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        recentUsers: {
            id: string;
            email: string;
            name: string;
            role: string;
            createdAt: Date;
        }[];
        recentBusinesses: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            category: string | null;
        }[];
        recentOrders: ({
            business: {
                name: string;
                slug: string;
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
        })[];
    }>;
    getUsers(): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        BusinessUser: ({
            business: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            businessId: string;
        })[];
    }[]>;
    updateUserRole(userId: string, dto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }>;
    getBusinesses(): Promise<{
        id: string;
        name: string;
        slug: string;
        category: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        productsCount: number;
        ordersCount: number;
        owner: {
            email: string;
            name: string;
        } | null;
    }[]>;
    deleteBusiness(businessId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

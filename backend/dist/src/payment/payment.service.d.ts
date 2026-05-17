import { PrismaService } from '../prisma.service';
import { PakasirCheckoutProvider } from '../order/providers/pakasir-checkout.provider';
export declare class PaymentService {
    private readonly prisma;
    private readonly pakasirCheckout;
    private readonly logger;
    constructor(prisma: PrismaService, pakasirCheckout: PakasirCheckoutProvider);
    handlePakasirWebhook(payload: {
        amount: number;
        order_id: string;
        project: string;
        status: string;
        payment_method: string;
        completed_at: string;
    }): Promise<{
        success: boolean;
        message: string;
        orderId?: undefined;
    } | {
        success: boolean;
        message: string;
        orderId: string;
    }>;
}

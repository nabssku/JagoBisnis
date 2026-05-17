import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
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

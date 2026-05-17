import { OrderStatus, PaymentStatus } from '@prisma/client';
export declare class UpdateOrderStatusDto {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
}

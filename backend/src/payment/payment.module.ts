import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../prisma.service';
import { PakasirCheckoutProvider } from '../order/providers/pakasir-checkout.provider';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, PakasirCheckoutProvider],
  exports: [PaymentService],
})
export class PaymentModule {}

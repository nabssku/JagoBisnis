import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma.service';
import { PakasirCheckoutProvider } from './providers/pakasir-checkout.provider';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, PakasirCheckoutProvider],
  exports: [OrderService],
})
export class OrderModule {}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook/pakasir')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive payment webhook notification from Pakasir' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid signature, amount mismatch, or project mismatch' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  handlePakasirWebhook(
    @Body()
    payload: {
      amount: number;
      order_id: string;
      project: string;
      status: string;
      payment_method: string;
      completed_at: string;
    },
  ) {
    return this.paymentService.handlePakasirWebhook(payload);
  }
}

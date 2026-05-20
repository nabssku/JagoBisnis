import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('Orders')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ==========================================
  // PUBLIC ENDPOINTS (No Auth Required)
  // ==========================================

  @Post('public/sites/:slug/orders')
  @ApiOperation({
    summary: 'Create a new public order from a published shop site',
  })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or inactive product/integration',
  })
  @ApiResponse({ status: 404, description: 'Site not found' })
  createPublicOrder(
    @Param('slug') slug: string,
    @Body() dto: CreatePublicOrderDto,
  ) {
    return this.orderService.createPublicOrder(slug, dto);
  }

  @Get('public/orders/:orderId/status')
  @ApiOperation({ summary: 'Get status of a public order (polling)' })
  @ApiResponse({ status: 200, description: 'Order status found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getPublicOrderStatus(@Param('orderId') orderId: string) {
    return this.orderService.getPublicOrderStatus(orderId);
  }

  // ==========================================
  // DASHBOARD ENDPOINTS (Protected, JWT Auth)
  // ==========================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('businesses/:businessId/orders')
  @ApiOperation({ summary: 'Get all orders for a business' })
  @ApiResponse({ status: 200, description: 'Orders list' })
  getBusinessOrders(
    @Param('businessId') businessId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.orderService.getBusinessOrders(businessId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('businesses/:businessId/orders/:orderId')
  @ApiOperation({ summary: 'Get specific order details for a business' })
  @ApiResponse({ status: 200, description: 'Order detail data' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getBusinessOrderDetail(
    @Param('businessId') businessId: string,
    @Param('orderId') orderId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.orderService.getBusinessOrderDetail(
      businessId,
      orderId,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('businesses/:businessId/orders/:orderId/status')
  @ApiOperation({ summary: 'Update status/payment state of a business order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - only OWNER or ADMIN allowed',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateBusinessOrderStatus(
    @Param('businessId') businessId: string,
    @Param('orderId') orderId: string,
    @Request() req: RequestWithUser,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateBusinessOrderStatus(
      businessId,
      orderId,
      req.user.id,
      dto,
    );
  }
}

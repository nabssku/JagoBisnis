import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  create(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(req.user.id, businessId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products for a business' })
  findAll(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
  ) {
    return this.productService.findAll(req.user.id, businessId);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.findOne(req.user.id, businessId, productId);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update product' })
  update(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(req.user.id, businessId, productId, dto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Soft delete product' })
  remove(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.remove(req.user.id, businessId, productId);
  }
}

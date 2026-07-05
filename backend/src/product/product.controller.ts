import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';

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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({ summary: 'Upload product image' })
  async uploadFile(
    @Param('businessId') businessId: string,
    @Request() req: any,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Also record this file in the Media library database for this business!
    const media = await this.productService.createMedia(req.user.id, businessId, file);
    return { url: media.url };
  }

  @Get('media')
  @ApiOperation({ summary: 'Get all uploaded media' })
  getMedia() {
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      return [];
    }
    const files = fs.readdirSync(uploadsDir);
    const mediaUrls = files
      .filter((file: string) => {
        const filePath = join(uploadsDir, file);
        const stat = fs.statSync(filePath);
        return stat.isFile() && file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
      })
      .map((file: string) => {
        const backendUrl = process.env.BACKEND_URL
          ? process.env.BACKEND_URL.replace(/\/$/, '')
          : 'http://localhost:3001';
        return {
          name: file,
          url: `${backendUrl}/uploads/${file}`,
        };
      });
    return mediaUrls;
  }

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

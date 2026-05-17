import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreatePublicOrderDto {
  @ApiProperty({ description: 'ID produk yang ingin dibeli', example: 'd3b07384-d113-4ec5-a5df-18071e8b7ec3' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Nama lengkap pelanggan', example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ description: 'Nomor telepon pelanggan', example: '081234567890' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiPropertyOptional({ description: 'Email pelanggan', example: 'budi@example.com' })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional({ description: 'Alamat pengiriman lengkap', example: 'Jl. Merdeka No. 10, Jakarta' })
  @IsString()
  @IsOptional()
  customerAddress?: string;

  @ApiProperty({ description: 'Jumlah produk yang dibeli', example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Metode pembayaran', example: 'MANUAL', enum: ['MANUAL', 'PAKASIR'] })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(MANUAL|PAKASIR)$/, {
    message: 'paymentMethod must be either MANUAL or PAKASIR',
  })
  paymentMethod: string;

  @ApiPropertyOptional({ description: 'Saluran pembayaran Pakasir', example: 'qris' })
  @IsString()
  @IsOptional()
  paymentChannel?: string;

  @ApiPropertyOptional({ description: 'Catatan tambahan untuk pesanan', example: 'Kirim setelah jam 5 sore' })
  @IsString()
  @IsOptional()
  notes?: string;
}

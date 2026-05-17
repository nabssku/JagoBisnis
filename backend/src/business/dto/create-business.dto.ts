import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ example: 'My Awesome Shop' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'my-awesome-shop' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug only allows lowercase, numbers, and dash',
  })
  slug?: string;

  @ApiPropertyOptional({ example: 'The best shop in town' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Retail' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No. 1' })
  @IsString()
  @IsOptional()
  address?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({ example: 'My Website' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'my-business' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug hanya boleh huruf kecil, angka, dan dash' })
  slug: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  theme?: any;

  @ApiPropertyOptional()
  @IsOptional()
  sections?: any[];
}

import { IsNotEmpty, IsEnum, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SocialPostProvider, MediaType } from '@prisma/client';

export class CreateSocialPostDto {
  @ApiProperty({ description: 'Platform penerbitan (INSTAGRAM atau THREADS)', enum: SocialPostProvider })
  @IsEnum(SocialPostProvider)
  @IsNotEmpty()
  provider: SocialPostProvider;

  @ApiProperty({ description: 'Isi teks atau caption postingan sosial' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Jenis media (TEXT, IMAGE, VIDEO, CAROUSEL)', enum: MediaType, default: MediaType.TEXT })
  @IsEnum(MediaType)
  @IsOptional()
  mediaType?: MediaType;

  @ApiProperty({ description: 'Daftar URL gambar/video dari pustaka', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls?: string[];
}

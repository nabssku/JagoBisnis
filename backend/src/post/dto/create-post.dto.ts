import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Judul Konten' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Slug Konten' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Gambar Cover dari media pustaka',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: 'Gambar tambahan max 8',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: 'Frasa kata kunci SEO', required: false })
  @IsString()
  @IsOptional()
  focusKeyword?: string;

  @ApiProperty({ description: 'Meta Title Google Search', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(60)
  metaTitle?: string;

  @ApiProperty({
    description: 'Meta Description Google Search',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  metaDescription?: string;

  @ApiProperty({ description: 'Isi Konten utama' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Ringkasan / snippet', required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    description: 'Jenis tombol CTA',
    required: false,
    default: 'Tanpa Tombol',
  })
  @IsString()
  @IsOptional()
  ctaType?: string;

  @ApiProperty({
    description: 'Nilai CTA (URL / Whatsapp No)',
    required: false,
  })
  @IsString()
  @IsOptional()
  ctaValue?: string;

  @ApiProperty({ description: 'Alt Text Gambar Cover', required: false })
  @IsString()
  @IsOptional()
  imageAlt?: string;

  @ApiProperty({
    description: 'Tipe Konten (Pembaruan, Artikel, Promo)',
    required: false,
    default: 'Artikel',
  })
  @IsString()
  @IsOptional()
  contentType?: string;

  @ApiProperty({
    description: 'Status Publikasi (Draft, Publik, Arsip)',
    required: false,
    default: 'Draft',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Ceklis disematkan',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @ApiProperty({
    description: 'Tags konten max 6',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Katalog terhubung IDs',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relatedProductIds?: string[];
}

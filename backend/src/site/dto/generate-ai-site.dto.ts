import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateAiSiteDto {
  @ApiProperty({ example: 'Kopi Bahagia' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'Kafe Kopi' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Mahasiswa & Anak muda' })
  @IsString()
  @IsNotEmpty()
  targetAudience: string;

  @ApiProperty({ example: 'Es Kopi Susu Aren dan Almond Croissant' })
  @IsString()
  @IsNotEmpty()
  keyService: string;

  @ApiProperty({ example: 'Warm & Cozy' })
  @IsString()
  @IsNotEmpty()
  visualStyle: string;
}

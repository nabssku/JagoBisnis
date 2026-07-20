import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditAiSectionDto {
  @ApiProperty({ example: '<div>...</div>' })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiProperty({ example: 'ubah warna background menjadi hitam pekat' })
  @IsString()
  @IsNotEmpty()
  instruction: string;

  @ApiProperty({ example: '#e8aa20' })
  @IsString()
  @IsNotEmpty()
  primaryColor: string;
}

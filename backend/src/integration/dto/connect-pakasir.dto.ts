import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectPakasirDto {
  @ApiProperty({ description: 'Slug proyek Pakasir', example: 'kedaikopi-pos' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'API Key proyek Pakasir', example: 'pk_live_1234abcd' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}

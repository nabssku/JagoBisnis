import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectGoogleAnalyticsDto {
  @ApiProperty({ description: 'GA4 Measurement ID', example: 'G-XXXXXXXXXX' })
  @IsString()
  @IsNotEmpty()
  measurementId: string;

  @ApiProperty({
    description: 'GA4 Measurement Protocol API Secret (optional)',
    example: 'abc123xyz',
    required: false,
  })
  @IsString()
  @IsOptional()
  apiSecret?: string;
}

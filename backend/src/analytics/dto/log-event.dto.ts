import { IsString, IsOptional, IsObject } from 'class-validator';

export class LogEventDto {
  @IsString()
  event: string;

  @IsString()
  path: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

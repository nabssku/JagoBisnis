import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSiteThemeDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  theme: any;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateSiteSectionsDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  sections: any[];
}

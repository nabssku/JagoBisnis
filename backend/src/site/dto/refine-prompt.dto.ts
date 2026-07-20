import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefinePromptDto {
  @ApiProperty({ example: 'barbershop dengan nama Barberutas' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

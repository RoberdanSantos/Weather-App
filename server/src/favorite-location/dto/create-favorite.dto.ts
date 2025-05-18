import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @IsString()
  @ApiProperty({ example: 'London', description: 'Nome da cidade' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'GB', description: 'País (código ISO ou nome)' })
  country: string;
}

import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogDto {
  @IsString()
  @ApiProperty({
    example: 'São Paulo',
    description: 'Nome da cidade pesquisada',
  })
  location: string;

  @IsNumber()
  @ApiProperty({
    example: 28,
    description: 'Temperatura no momento da busca (°C)',
  })
  temperature: number;

  @IsString()
  @ApiProperty({
    example: 'ensolarado',
    description: 'Condição climática simplificada',
  })
  condition: string;
}

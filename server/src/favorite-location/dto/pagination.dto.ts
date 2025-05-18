import { IsOptional, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ example: '1', description: 'Página atual (default: 1)' })
  page?: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ example: '10', description: 'Itens por página (default: 10)' })
  limit?: string;
}

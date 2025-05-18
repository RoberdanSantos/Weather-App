import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty({ example: 'token.jwt.aqui' })
  @IsString()
  token: string;
}

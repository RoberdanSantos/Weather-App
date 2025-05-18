import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'token.jwt.aqui' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'novaSenha123', minLength: 6 })
  @MinLength(6)
  newPassword: string;
}

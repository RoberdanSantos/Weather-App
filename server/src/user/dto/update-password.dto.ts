import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'senha_atual123',
    description: 'Senha atual do usuário',
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({ example: 'nova_senha456', description: 'Nova senha desejada' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

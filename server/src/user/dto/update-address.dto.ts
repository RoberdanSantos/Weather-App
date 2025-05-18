import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ example: '12345678', description: 'CEP com 8 dígitos' })
  @IsString()
  @Length(8, 8)
  cep: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Nome da rua' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '123', description: 'Número da residência' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Bairro Central', description: 'Nome do bairro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado' })
  @IsString()
  @IsNotEmpty()
  state: string;
}

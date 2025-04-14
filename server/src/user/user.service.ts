import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { address: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new Error('Senha atual incorreta');
    }
  
    const hashed = await bcrypt.hash(dto.newPassword, 10);
  
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  
    return { message: 'Senha atualizada com sucesso' };
  }

  async updateAddress(userId: string, dto: UpdateAddressDto) {
    const existing = await this.prisma.address.findUnique({
      where: { userId },
    });
  
    return existing
      ? this.prisma.address.update({ where: { userId }, data: { ...dto, userId } })
      : this.prisma.address.create({ data: { ...dto, userId } });
  }  
}

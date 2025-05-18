import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { address: true },
      });
      if (!user) throw new NotFoundException('Usuário não encontrado');
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new InternalServerErrorException('Erro ao atualizar perfil');
    }
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuário não encontrado');

      const valid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!valid) throw new UnauthorizedException('Senha atual incorreta');

      const hashed = await bcrypt.hash(dto.newPassword, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      return { message: 'Senha atualizada com sucesso' };
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('Erro ao atualizar senha');
    }
  }

  async deleteAccount(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuário não encontrado');

      return await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao excluir conta');
    }
  }

  async updateAddress(userId: string, dto: UpdateAddressDto) {
    try {
      const existing = await this.prisma.address.findUnique({ where: { userId } });

      return existing
        ? await this.prisma.address.update({
            where: { userId },
            data: { ...dto, userId },
          })
        : await this.prisma.address.create({
            data: { ...dto, userId },
          });
    } catch {
      throw new InternalServerErrorException('Erro ao atualizar endereço');
    }
  }

  async updateRecentCity(userId: string, city: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuário não encontrado');

      const address = await this.prisma.address.findUnique({ where: { userId } });
      const userCity = address?.city;

      if (city === userCity) return user;

      let updated = user.recentCities || [];
      updated = [city, ...updated.filter((c) => c !== city)].slice(0, 6);

      return await this.prisma.user.update({
        where: { id: userId },
        data: { recentCities: updated },
      });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao atualizar cidade recente');
    }
  }
}
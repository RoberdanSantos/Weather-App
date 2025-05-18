import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private generateToken(payload: { sub: string; email: string }) {
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Erro ao validar usuário');
    }
  }

  async login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.generateToken(payload) };
  }

  async register(data: CreateUserDto) {
    try {
      const hashed = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashed,
          name: data.name,
          recentCities: [
            'New York',
            'London',
            'Tokyo',
            'Paris',
            'Sydney',
            'Rio de Janeiro',
          ],
        },
      });

      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.generateToken(payload),
        id: user.id,
      };
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new BadRequestException('Email já cadastrado');
      }
      throw new InternalServerErrorException('Erro ao registrar usuário');
    }
  }

  async findByIdWithAddress(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { address: true },
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');
      return user;
    } catch {
      throw new InternalServerErrorException('Erro ao buscar perfil');
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException('Usuário não encontrado');

      const token = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '15m' },
      );

      await this.prisma.passwordResetToken.create({
        data: { userId: user.id, token },
      });

      return { message: 'Token gerado com sucesso.', token };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao gerar token de recuperação',
      );
    }
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      const record = await this.prisma.passwordResetToken.findFirst({
        where: { token, userId },
      });

      if (!record)
        throw new UnauthorizedException('Token inválido ou expirado');

      const hashed = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      await this.prisma.passwordResetToken.delete({ where: { id: record.id } });

      return { message: 'Senha redefinida com sucesso.' };
    } catch (err) {
      throw new UnauthorizedException('Erro ao redefinir senha');
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, decoded };
    } catch {
      return { valid: false };
    }
  }
}

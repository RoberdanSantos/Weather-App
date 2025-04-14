import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
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

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateUserDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
      },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
      },
    });

    return { message: 'Token gerado. Envie por e-mail ou outra forma.', token };
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto) {
    const payload = this.jwtService.verify(token);
    const userId = payload.sub;

    const record = await this.prisma.passwordResetToken.findFirst({
      where: { token, userId },
    });

    if (!record) throw new UnauthorizedException('Token inválido ou expirado');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    await this.prisma.passwordResetToken.delete({ where: { id: record.id } });

    return { message: 'Senha redefinida com sucesso.' };
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, decoded };
    } catch {
      return { valid: false };
    }
  }

  async logout() {
    return { message: 'Logout simulado com sucesso (stateless)' };
  }
}
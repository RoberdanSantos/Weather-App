import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: '1',
          email: 'test@example.com',
          password: await bcrypt.hash('123456', 10),
        }),
        create: jest.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
        update: jest.fn().mockResolvedValue(true),
      },
      passwordResetToken: {
        create: jest.fn().mockResolvedValue({ token: 'tok' }),
        findFirst: jest.fn().mockResolvedValue({ id: '123', userId: '1' }),
        delete: jest.fn().mockResolvedValue(true),
      },
    };

    service = new AuthService(new JwtService({ secret: 'test' }), prisma as PrismaService);
  });

  it('should validate user correctly', async () => {
    const user = await service.validateUser('test@example.com', '123456');
    expect(user).toBeDefined();
  });

  it('should login and return token', async () => {
    const result = await service.login({ id: '1', email: 'test@example.com' });
    expect(result.access_token).toBeDefined();
  });

  it('should register user', async () => {
    const result = await service.register({ email: 'a@a.com', name: 'Ana', password: '123456' });
    expect(result).toHaveProperty('id');
  });

  it('should generate a reset token', async () => {
    const result = await service.forgotPassword('test@example.com');
    expect(result).toHaveProperty('token');
  });

  it('should reset password successfully', async () => {
    const token = new JwtService({ secret: 'test' }).sign({ sub: '1' });
    const result = await service.resetPassword({ token, newPassword: 'novaSenha123' });
    expect(result.message).toContain('Senha');
  });

  it('should verify valid token', async () => {
    const token = new JwtService({ secret: 'test' }).sign({ sub: '1' });
    const result = await service.verifyToken(token);
    expect(result.valid).toBe(true);
  });

  it('should return false for invalid token', async () => {
    const result = await service.verifyToken('invalid.token');
    expect(result.valid).toBe(false);
  });
});

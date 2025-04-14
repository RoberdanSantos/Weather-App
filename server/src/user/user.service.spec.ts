import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: '1',
          password: await bcrypt.hash('123456', 10),
        }),
        update: jest.fn().mockResolvedValue(true),
      },
    };

    service = new UserService(prisma as PrismaService);
  });

  it('should update password if current matches', async () => {
    const result = await service.updatePassword('1', {
      currentPassword: '123456',
      newPassword: 'novaSenha456',
    });

    expect(result.message).toBe('Senha atualizada com sucesso');
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('should throw if current password is wrong', async () => {
    const user = await bcrypt.hash('correta', 10);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      password: user,
    });

    await expect(
      service.updatePassword('1', {
        currentPassword: 'errada',
        newPassword: 'qualquer',
      }),
    ).rejects.toThrow('Senha atual incorreta');
  });
});

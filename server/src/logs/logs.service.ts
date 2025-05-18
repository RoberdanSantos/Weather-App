import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async createSearchLog(
    userId: string,
    data: { location: string; temperature: number; condition: string },
  ) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuário não encontrado');

      const userAddress = await this.prisma.address.findUnique({
        where: { userId },
      });

      const city = userAddress?.city;
      if (city === data.location) return;

      return await this.prisma.searchLog.create({
        data: {
          userId,
          location: data.location,
          temperature: data.temperature,
          condition: data.condition,
        },
      });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao registrar log de busca');
    }
  }

  async getUserLogs(userId: string, page = 1, limit = 10) {
    try {
      const [logs, total] = await Promise.all([
        this.prisma.searchLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.searchLog.count({ where: { userId } }),
      ]);

      return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (err) {
      throw new InternalServerErrorException('Erro ao buscar histórico');
    }
  }

  async deleteLog(id: string, userId: string) {
    try {
      const log = await this.prisma.searchLog.findUnique({ where: { id } });

      if (!log || log.userId !== userId) {
        throw new NotFoundException(
          'Log não encontrado ou não pertence ao usuário',
        );
      }

      return await this.prisma.searchLog.delete({ where: { id } });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao remover log');
    }
  }

  async clearAllLogs(userId: string) {
    try {
      return await this.prisma.searchLog.deleteMany({ where: { userId } });
    } catch {
      throw new InternalServerErrorException('Erro ao limpar os logs');
    }
  }
}

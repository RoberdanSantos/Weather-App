import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoriteLocationService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    try {
      return await this.prisma.favoriteLocation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      throw new InternalServerErrorException('Erro ao buscar favoritos');
    }
  }

  async findAllPaginated(userId: string, page = 1, limit = 10) {
    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.favoriteLocation.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.favoriteLocation.count({ where: { userId } }),
      ]);

      return {
        favorites: data,
        totalPages: Math.ceil(total / limit),
        total,
        page,
      };
    } catch (err) {
      throw new InternalServerErrorException('Erro ao buscar favoritos');
    }
  }

  async create(userId: string, data: { name: string; country: string }) {
    try {
      const existing = await this.prisma.favoriteLocation.findFirst({
        where: { userId, name: data.name },
      });

      if (existing) {
        throw new ConflictException('Local já está nos favoritos');
      }

      return await this.prisma.favoriteLocation.create({
        data: { ...data, userId },
      });
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException('Erro ao adicionar favorito');
    }
  }

  async remove(userId: string, locationId: string) {
    try {
      const location = await this.prisma.favoriteLocation.findUnique({
        where: { id: locationId },
      });

      if (!location || location.userId !== userId) {
        throw new NotFoundException(
          'Local favorito não encontrado ou não pertence ao usuário',
        );
      }

      return await this.prisma.favoriteLocation.delete({
        where: { id: locationId },
      });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao remover favorito');
    }
  }
}

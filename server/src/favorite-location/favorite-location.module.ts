import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FavoriteLocationService } from './favorite-location.service';
import { FavoriteLocationController } from './favorite-location.controller';

@Module({
  providers: [FavoriteLocationService, PrismaService],
  controllers: [FavoriteLocationController]
})
export class FavoriteLocationModule {}

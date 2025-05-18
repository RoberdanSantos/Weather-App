import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogService } from './logs.service';
import { LogController } from './logs.controller';

@Module({
  providers: [LogService, PrismaService],
  controllers: [LogController]
})
export class LogsModule {}

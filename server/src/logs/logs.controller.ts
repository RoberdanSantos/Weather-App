import {
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LogService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { PaginationDto } from 'favorite-location/dto/pagination.dto';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogController {
  constructor(private readonly searchLogService: LogService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nova busca de clima' })
  @ApiResponse({ status: 201, description: 'Busca registrada com sucesso' })
  create(@Request() req, @Body() body: CreateLogDto) {
    return this.searchLogService.createSearchLog(req.user.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar histórico de buscas do usuário' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  findAll(@Request() req, @Query() query: PaginationDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    return this.searchLogService.getUserLogs(req.user.userId, page, limit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover busca específica do histórico' })
  @ApiResponse({ status: 200, description: 'Busca removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Busca não encontrada ou não pertence ao usuário' })
  remove(@Request() req, @Param('id') id: string) {
    return this.searchLogService.deleteLog(id, req.user.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Limpar todo o histórico de buscas do usuário' })
  @ApiResponse({ status: 200, description: 'Histórico limpo com sucesso' })
  clearAll(@Request() req) {
    return this.searchLogService.clearAllLogs(req.user.userId);
  }
}

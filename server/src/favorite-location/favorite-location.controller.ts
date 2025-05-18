import {
  Controller,
  UseGuards,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FavoriteLocationService } from './favorite-location.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoriteLocationController {
  constructor(private readonly service: FavoriteLocationService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os favoritos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de cidades favoritas' })
  getAll(@Request() req) {
    return this.service.findAll(req.user.userId);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Listar favoritos paginados' })
  @ApiResponse({ status: 200, description: 'Lista paginada de favoritos' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  getAllPaginated(@Request() req, @Query() query: PaginationDto) {
    const pageNumber = parseInt(query.page || '1', 10);
    const limitNumber = parseInt(query.limit || '10', 10);
    return this.service.findAllPaginated(
      req.user.userId,
      pageNumber,
      limitNumber,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar uma cidade aos favoritos' })
  @ApiResponse({ status: 201, description: 'Cidade adicionada aos favoritos' })
  @ApiResponse({ status: 409, description: 'Cidade já está nos favoritos' })
  add(@Request() req, @Body() body: CreateFavoriteDto) {
    return this.service.create(req.user.userId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma cidade dos favoritos' })
  @ApiResponse({ status: 200, description: 'Cidade removida dos favoritos' })
  @ApiResponse({
    status: 404,
    description: 'Cidade não encontrada ou não pertence ao usuário',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(req.user.userId, id);
  }
}

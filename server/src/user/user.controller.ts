import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Usuário')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
  getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Atualizar nome ou email do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  updateProfile(@Request() req, @Body() body: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, body);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Atualizar senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso' })
  updatePassword(@Request() req, @Body() body: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.userId, body);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Excluir conta do usuário' })
  @ApiResponse({ status: 200, description: 'Conta excluída com sucesso' })
  deleteAccount(@Request() req) {
    return this.userService.deleteAccount(req.user.userId);
  }

  @Patch('address')
  @ApiOperation({ summary: 'Atualizar ou cadastrar endereço do usuário' })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  updateAddress(@Request() req, @Body() body: UpdateAddressDto) {
    return this.userService.updateAddress(req.user.userId, body);
  }

  @Patch('recent-city')
  @ApiOperation({ summary: 'Atualizar cidade recente do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Cidade recente atualizada com sucesso',
  })
  updateRecentCity(@Request() req, @Body() body: { city: string }) {
    return this.userService.updateRecentCity(req.user.userId, body.city);
  }
}

import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @Patch('update')
  updateProfile(@Request() req, @Body() body: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, body);
  }

  @Patch('password')
  updatePassword(@Request() req, @Body() body: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.userId, body);
  }

  @Patch('address')
  updateAddress(@Request() req, @Body() body: UpdateAddressDto) {
    return this.userService.updateAddress(req.user.userId, body);
  }
}

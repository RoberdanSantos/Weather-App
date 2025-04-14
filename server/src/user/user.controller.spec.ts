import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    address: {
      street: 'Rua X',
      city: 'Cidade Y',
    },
  };

  const mockUserService = {
    findById: jest.fn().mockResolvedValue(mockUser),
    updateProfile: jest.fn().mockResolvedValue({ ...mockUser, name: 'Atualizado' }),
    updateAddress: jest.fn().mockResolvedValue({
      ...mockUser.address,
      street: 'Nova Rua',
    }),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { userId: '1' };
          return true;
        },
      })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should get user profile (/user/me)', async () => {
    const result = await controller.getProfile({ user: { userId: '1' } });
    expect(result).toEqual(mockUser);
    expect(service.findById).toHaveBeenCalledWith('1');
  });

  it('should update user profile (/user/update)', async () => {
    const dto: UpdateUserDto = { name: 'Atualizado' };
    const result = await controller.updateProfile({ user: { userId: '1' } }, dto);
    expect(result.name).toBe('Atualizado');
    expect(service.updateProfile).toHaveBeenCalledWith('1', dto);
  });

  it('should update user address (/user/address)', async () => {
    const dto: UpdateAddressDto = {
      cep: '49000000',
      number: '123',
      street: 'Nova Rua',
      neighborhood: 'Centro',
      city: 'Aracaju',
      state: 'SE',
    };
    const result = await controller.updateAddress({ user: { userId: '1' } }, dto);
    expect(result.street).toBe('Nova Rua');
    expect(service.updateAddress).toHaveBeenCalledWith('1', dto);
  });

  it('should update user password (/user/password)', async () => {
    const dto: UpdatePasswordDto = {
      currentPassword: '123456',
      newPassword: 'newpassword123',
    };
  
    mockUserService.updatePassword = jest
      .fn()
      .mockResolvedValue({ message: 'Senha atualizada com sucesso' });
  
    const result = await controller.updatePassword({ user: { userId: '1' } }, dto);
    expect(result.message).toBe('Senha atualizada com sucesso');
    expect(service.updatePassword).toHaveBeenCalledWith('1', dto);
  });
});

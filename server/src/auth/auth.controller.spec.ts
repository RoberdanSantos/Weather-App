import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ id: '1', email: 'a@a.com' }),
    validateUser: jest.fn().mockResolvedValue({ id: '1', email: 'a@a.com' }),
    login: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
    forgotPassword: jest.fn().mockResolvedValue({ token: 'reset_token' }),
    resetPassword: jest.fn().mockResolvedValue({ message: 'Senha redefinida com sucesso.' }),
    verifyToken: jest.fn().mockResolvedValue({ valid: true }),
    logout: jest.fn().mockResolvedValue({ message: 'Logout simulado com sucesso (stateless)' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: '1', email: 'a@a.com' };
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const dto: CreateUserDto = { email: 'a@a.com', password: '123456', name: 'Ana' };
    const result = await controller.register(dto);
    expect(result).toEqual({ id: '1', email: 'a@a.com' });
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('should login and return token', async () => {
    const dto: LoginDto = { email: 'a@a.com', password: '123456' };
    const result = await controller.login(dto);
    expect(result).toEqual({ access_token: 'mock_token' });
    expect(authService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
  });

  it('should return user profile', () => {
    const req = { user: { id: '1', email: 'a@a.com' } };
    const result = controller.getProfile(req);
    expect(result).toEqual({ id: '1', email: 'a@a.com' });
  });

  it('should handle forgot password', async () => {
    const dto: ForgotPasswordDto = { email: 'a@a.com' };
    const result = await controller.forgotPassword(dto);
    expect(result).toEqual({ token: 'reset_token' });
  });

  it('should reset password', async () => {
    const dto: ResetPasswordDto = { token: 'reset_token', newPassword: 'newPass123' };
    const result = await controller.resetPassword(dto);
    expect(result).toEqual({ message: 'Senha redefinida com sucesso.' });
  });

  it('should verify token', async () => {
    const dto: VerifyTokenDto = { token: 'mock_token' };
    const result = await controller.verifyToken(dto);
    expect(result).toEqual({ valid: true });
  });

  it('should logout', async () => {
    const result = await controller.logout();
    expect(result).toEqual({ message: 'Logout simulado com sucesso (stateless)' });
  });
});

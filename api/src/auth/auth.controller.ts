import {
  UserLoginDTO,
  UserLoginResponseDTO,
} from '@/shared/users/user-login/user-login.dto';
import { UserLoginSchema } from '@/shared/users/user-login/user-login.schemas';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicRoute } from 'src/auth/public-route.decorator';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { ResourceNotFoundException } from 'src/internals/server/resource-not-found.exception';
import { ValidationPipe } from 'src/internals/validation/validation.pipe';
import * as bcrypt from 'bcryptjs';
import { JwtService } from 'src/internals/api/jwt.service';
import { UserRegisterSchema } from '@/shared/users/user-register/user-register.schemas';
import {
  UserRegisterDTO,
  UserRegisterResponseDTO,
} from '@/shared/users/user-register/user-register.dto';
import { UserRole } from '@prisma/client';
import { UserAuthTokenSchema } from '@/shared/users/user-token/user-token.schemas';
import {
  UserAuthResponseDTO,
  UserAuthTokenDTO,
} from '@/shared/users/user-token/user-token.dto';
import { AuthContext } from './auth-context';
import { WithAuthContext } from './auth-context.decorator';
import { RegisterPushTokenSchema } from '@/shared/users/user-push-token/reister-push-token.schemas';
import { RegisterPushTokenDTO } from '@/shared/users/user-push-token/register-push-token.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaClientService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  @PublicRoute()
  async loginUser(
    @Body(new ValidationPipe(UserLoginSchema)) userLogin: UserLoginDTO,
  ): Promise<UserLoginResponseDTO> {
    return this.prisma.getClient().$transaction(async (tx) => {
      const userData = await tx.user.findUnique({
        where: { email: userLogin.email },
        include: { conversations: true },
      });

      if (!userData) {
        throw new ResourceNotFoundException();
      }

      const checkValidPassword = await bcrypt.compare(
        userLogin.password,
        userData.password,
      );
      if (checkValidPassword) {
        const accesspayload = {
          id: userData.id,
          role: userData.role,
          duration: '300s',
        };
        const refreshpayload = {
          id: userData.id,
          role: userData.role,
          duration: '10d',
        };

        const accessToken = await this.jwtService.signToken(accesspayload);
        const refreshToken = await this.jwtService.signToken(refreshpayload);

        if (accessToken.success) {
          await tx.user.update({
            where: { id: userData.id },
            data: { refresh_token: refreshToken.token },
          });

          return {
            access_token: accessToken.token,
            refresh_token: refreshToken.token,
            conversation: userData.conversations,
            fullname: userData.fullname,
            userId: userData.id,
          };
        } else {
          throw new BadRequestException('Failed to generate token');
        }
      } else {
        throw new UnauthorizedException('invalid password');
      }
    });
  }

  @Post('/register')
  @PublicRoute()
  async registerUser(
    @Body(new ValidationPipe(UserRegisterSchema)) userRegister: UserRegisterDTO,
  ): Promise<UserRegisterResponseDTO> {
    return this.prisma.getClient().$transaction(async (tx) => {
      const checkUniqueEmail = await tx.user.findFirst({
        where: { email: userRegister.email },
      });
      if (checkUniqueEmail) {
        throw new BadRequestException('User already exist');
      }

      const hashedPassword = await bcrypt.hash(userRegister.password, 10);

      if (!hashedPassword) {
        throw new BadRequestException('Password hashing failed');
      }

      const registerUser = await tx.user.create({
        data: {
          fullname: userRegister.fullname,
          email: userRegister.email,
          password: hashedPassword,
          refresh_token: '',
          role: UserRole.USER,
        },
        include: {
          conversations: true,
        },
      });

      const payload = {
        id: registerUser.id,
        role: registerUser.role,
        duration: '300s',
      };
      const getToken = await this.jwtService.signToken(payload);
      const refreshToken = await this.jwtService.signToken({
        id: registerUser.id,
        role: registerUser.role,
        duration: '10d',
      });

      await tx.user.update({
        data: {
          refresh_token: refreshToken.token,
        },
        where: { id: registerUser.id },
      });

      if (getToken.success) {
        return {
          userId: registerUser.id,
          access_token: getToken.token,
          refresh_token: refreshToken.token,
          conversation: registerUser.conversations,
          fullname: registerUser.fullname,
        };
      } else {
        throw new BadRequestException('Token-signin-error');
      }
    });
  }

  @Post('/refresh-token')
  @PublicRoute()
  async refreshToken(
    @Body(new ValidationPipe(UserAuthTokenSchema))
    userAuthToken: UserAuthTokenDTO,
  ): Promise<UserAuthResponseDTO> {
    return this.prisma.getClient().$transaction(async (tx) => {
      const checkUser = await tx.user.findFirst({
        where: { refresh_token: userAuthToken.refreshToken },
      });
      if (!checkUser) throw new UnauthorizedException('user-not-found');

      const accesspayload = {
        id: checkUser.id,
        role: checkUser.role,
        duration: '300s',
      };
      const newAccessToken = await this.jwtService.signToken(accesspayload);

      return {
        access_token: newAccessToken.token,
      };
    });
  }

  @Post('/register-token')
  async registerPushtoken(
    @WithAuthContext()
    authContext: AuthContext,
    @Body(new ValidationPipe(RegisterPushTokenSchema))
    registerToken: RegisterPushTokenDTO,
  ) {
    return await this.prisma.getClient().$transaction(async (tx) => {
      const findUser = await tx.pushToken.findFirst({
        where: { userId: authContext.user.id },
      });

      if (findUser) {
        await tx.pushToken.update({
          where: { userId: authContext.user.id },
          data: { token: registerToken.token },
        });
      } else {
        const register = await tx.pushToken.create({
          data: { token: registerToken.token, userId: authContext.user.id },
        });
        return register;
      }
    });
  }
}

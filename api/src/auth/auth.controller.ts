import {
  UserLoginDTO,
  UserLoginResponseDTO,
} from '@/shared/users/user-login/user-login.dto';
import { UserLoginSchema } from '@/shared/users/user-login/user-login.schemas';
import {
  BadRequestException,
  Get,
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
import { v1 } from 'uuid';
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
import { EventGateway } from 'src/event/event.gateway';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaClientService,
    private readonly jwtService: JwtService,
    private readonly event: EventGateway,
  ) {}

  @Get('/session')
  async getSession(@WithAuthContext() authContext: AuthContext) {
    return {
      user: { id: authContext.user.id },
    };
  }

  @Post('/login')
  @PublicRoute()
  async loginUser(
    @Body(new ValidationPipe(UserLoginSchema)) userLogin: UserLoginDTO,
  ): Promise<UserLoginResponseDTO> {
    return this.prisma.getClient().$transaction(async (tx) => {
      const userData = await tx.user.findUnique({
        where: { email: userLogin.email },
        include: { messages: true, conversations: true },
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
          duration: '20s',
        };
        const refreshpayload = {
          id: userData.id,
          role: userData.role,
          duration: '7d',
        };

        const accessToken = await this.jwtService.signToken(accesspayload);
        const refreshToken = await this.jwtService.signToken(refreshpayload);

        if (accessToken.success) {
          await tx.user.update({
            where: { id: userData.id },
            data: { refresh_token: refreshToken.token },
          });
          // const status = { userId: userData.id, status: 'Online' };
          // this.event.handleConnection(status);

          return {
            token: accessToken.token,
            refresh_token: refreshToken.token,
            messages: userData.messages,
            conversations: userData.conversations,
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
      const refreshToken = v1();

      const registerUser = await tx.user.create({
        data: {
          fullname: userRegister.fullname,
          email: userRegister.email,
          password: hashedPassword,
          refresh_token: refreshToken,
          role: UserRole.USER,
        },
      });

      const payload = {
        id: registerUser.id,
        role: registerUser.role,
        duration: '300s',
      };
      const getToken = await this.jwtService.signToken(payload);

      if (getToken.success) {
        return {
          userId: registerUser.id,
          token: getToken.token,
          refresh_token: refreshToken,
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
        duration: '20s',
      };
      const newAccessToken = await this.jwtService.signToken(accesspayload);
      // const newRefreshToken = await this.jwtService.signToken(refreshpayload);

      // await tx.user.update({
      //   where: { id: checkUser.id },
      //   data: { refresh_token: newRefreshToken.token },
      // });

      return {
        accessToken: newAccessToken.token,
        refreshToken: userAuthToken.refreshToken,
      };
    });
  }

  @Post('/register-token')
  async registerPushtoken(
    @Body(new ValidationPipe(RegisterPushTokenSchema))
    @WithAuthContext()
    authContext: AuthContext,
    registerToken: RegisterPushTokenDTO,
  ) {
    const register = await this.prisma.getClient().pushToken.create({
      data: { token: registerToken.token, userId: authContext.user.id },
    });

    return register;
  }
}

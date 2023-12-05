import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { WithAuthContext } from './auth-context.decorator';
import { AuthContext } from './auth-context';
import { PublicRoute } from './public-route.decorator';
import { ValidationPipe } from 'src/internals/validation/validation.pipe';
import {
  UserLoginDTO,
  UserLoginResponseDTO,
} from '@/shared/users/user-login/user-login.dto';
import { UserLoginSchema } from '@/shared/users/user-login/user-login.schemas';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { ResourceNotFoundException } from 'src/internals/server/resource-not-found.exception';
import * as bcrypt from 'bcryptjs';
import { JwtService } from 'src/internals/api/jwt.service';
import { UserRegisterSchema } from '@/shared/users/user-register/user-register.schemas';
import {
  UserRegisterDTO,
  UserRegisterResponseDTO,
} from '@/shared/users/user-register/user-register.dto';
import { UserRole } from '@prisma/client';
import { throwError } from 'src/internals/utils/throw-error';
import { UserAuthTokenSchema } from '@/shared/users/user-token/user-token.schemas';
import { UserAuthTokenDTO } from '@/shared/users/user-token/user-token.dto';
import { v1 } from 'uuid';

enum ErrorMessage {
  WENT_WRONG = 'Something went wrong!',
}

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaClientService,
    private readonly jwtService: JwtService,
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
        where: { username: userLogin.username },
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
        const payload = { id: userData.id, role: userData.role };

        const generateToken = await this.jwtService.signToken(payload);
        const refreshToken = v1();

        if (generateToken.success) {
          await tx.user.update({
            where: { id: userData.id },
            data: { refresh_token: refreshToken },
          });

          return { token: generateToken.token, refresh_token: refreshToken };
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

      const checkUniqueUsername = await tx.user.findFirst({
        where: { username: userRegister.username },
      });

      if (checkUniqueUsername) {
        throwError('Username already exist');
      }

      const hashedPassword = await bcrypt.hash(userRegister.password, 10);

      if (!hashedPassword) {
        throw new BadRequestException('Password hashing failed');
      }
      const refreshToken = v1();

      const registerUser = await tx.user.create({
        data: {
          username: userRegister.username,
          email: userRegister.email,
          password: hashedPassword,
          refresh_token: refreshToken,
          role: UserRole.USER,
        },
      });

      const payload = { id: registerUser.id, role: registerUser.role };
      const getToken = await this.jwtService.signToken(payload);

      if (getToken.success) {
        return {
          success: true,
          token: getToken.token,
          refresh_token: refreshToken,
        };
      } else {
        return {
          success: false,
          token: '',
          refresh_token: '',
        };
      }
    });
  }

  @Get(':token/token/:refreshToken')
  @PublicRoute()
  async getToken(
    @Param(new ValidationPipe(UserAuthTokenSchema)) param: UserAuthTokenDTO,
  ): Promise<string> {
    const verifyToken = await this.jwtService.verifyToken(param.token);

    if (verifyToken.success) return param.token;

    const checkUser = await this.prisma
      .getClient()
      .user.findFirst({ where: { refresh_token: param.refreshToken } });

    if (checkUser) {
      const payload = { id: checkUser.id, role: checkUser.role };
      const newToken = await this.jwtService.signToken(payload);

      return newToken.success ? newToken.token : ErrorMessage.WENT_WRONG;
    } else {
      return ErrorMessage.WENT_WRONG;
    }
  }
}

import {
  UserTokenDTO,
  UserTokenStatus,
} from '@/shared/users/user-token/user-token.dto';
import { PrismaClientService } from '../database/prisma-client.service';
import * as jwt from 'jsonwebtoken';
import { EnvironmentVariables } from '../runtime/environment-variables';
import { UnauthorizedException } from '@nestjs/common';
import { ResourceNotFoundException } from '../server/resource-not-found.exception';
import { UserRole } from '@prisma/client';

export class JwtService {
  constructor(private readonly prisma: PrismaClientService) {}

  async verifyToken(authToken: string): Promise<UserTokenStatus> {
    try {
      const decodedToken = jwt.verify(
        authToken,
        EnvironmentVariables.JWT_SECRET,
      ) as UserTokenDTO;

      return {
        message: '',
        success: true,
        user: { id: decodedToken.id, role: decodedToken.role },
      };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return {
          message: '',
          success: false,
          user: { id: '', role: '' },
        };
      }

      throw new UnauthorizedException('Invalid token');
    }
  }

  async signToken({
    id,
    role,
    duration,
  }: {
    id: string;
    role: UserRole;
    duration: string;
  }): Promise<{ success: boolean; token: string }> {
    const payload = { id, role };
    try {
      const token = jwt.sign(payload, EnvironmentVariables.JWT_SECRET, {
        expiresIn: duration,
      });

      return { success: true, token: token };
    } catch (err) {
      throw new ResourceNotFoundException();
    }
  }
}

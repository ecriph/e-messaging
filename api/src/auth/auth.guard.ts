import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { z } from 'zod';
import {
  PublicRouteMetadata,
  PUBLIC_ROUTE_METADATA_KEY,
} from './public-route.decorator';
import {
  RouteRolesMetadata,
  ROUTE_ROLES_METADATA_KEY,
} from './roles/roles.decorator';
import { AuthContext } from './auth-context';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { HttpRequest } from 'src/internals/server/http-request-types';
import { JwtService } from 'src/internals/api/jwt.service';

const AuthTokenSchema = z
  .string()
  .optional()
  .refine((s) => s == undefined || s.startsWith('Bearer '))
  .transform((s) => {
    if (s == null) {
      return undefined;
    }

    return s.replace('Bearer ', '');
  });

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaClient: PrismaClientService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<true> {
    if (context.getType() !== 'http') {
      throw new Error('Unknown execution context');
    }

    const request: HttpRequest = context
      .switchToHttp()
      .getRequest<HttpRequest>();

    const isPublic = this.reflector.get<PublicRouteMetadata | undefined>(
      PUBLIC_ROUTE_METADATA_KEY,
      context.getHandler(),
    );

    const authTokenIdValidationResult = AuthTokenSchema.safeParse(
      request.header('authorization'),
    );

    if (!authTokenIdValidationResult.success) {
      throw new UnauthorizedException();
    }

    const authToken = authTokenIdValidationResult.data;

    if (authToken) {
      const decodedIdToken = await (async () => {
        try {
          return await this.jwtService.verifyToken(authToken);
        } catch (err) {
          throw new UnauthorizedException();
        }
      })();

      if (!decodedIdToken.success) {
        throw new UnauthorizedException();
      }

      await this.prismaClient.getClient().$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: { id: decodedIdToken.user.id },
        });

        if (!user) {
          throw new UnauthorizedException();
        } else {
          request.authContext = new AuthContext({
            user: { id: user.id, role: user.role },
          });
        }
      });
    }

    if (isPublic) {
      return true;
    } else {
      if (request.authContext) {
        const rolesMetadata = this.reflector.get<RouteRolesMetadata>(
          ROUTE_ROLES_METADATA_KEY,
          context.getHandler(),
        );

        if (rolesMetadata) {
          const currentUserRole = request.authContext.user.role;

          const isAllowed =
            rolesMetadata.allowedRoles.includes(currentUserRole);

          if (isAllowed) {
            return true;
          } else {
            throw new ForbiddenException();
          }
        }

        return true;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}

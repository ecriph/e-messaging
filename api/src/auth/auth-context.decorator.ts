import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthContext } from './auth-context';
import { HttpRequest } from 'src/internals/server/http-request-types';
import { throwError } from 'src/internals/utils/throw-error';
import { EnforceParameterDecoratorTypesafety } from 'src/internals/utils/typesafe-parameter-decorator';

export const WithAuthContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthContext => {
    const request = ctx.switchToHttp().getRequest<HttpRequest>();

    return request.authContext ?? throwError();
  },
  [EnforceParameterDecoratorTypesafety(AuthContext)],
);

export const WithOptionalAuthContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): undefined | AuthContext => {
    const request = ctx.switchToHttp().getRequest<HttpRequest>();

    return request.authContext;
  },
  [EnforceParameterDecoratorTypesafety(AuthContext)],
);

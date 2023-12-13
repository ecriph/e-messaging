import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { JwtService } from 'src/internals/api/jwt.service';
export declare class AuthGuard implements CanActivate {
    private reflector;
    private prismaClient;
    private jwtService;
    constructor(reflector: Reflector, prismaClient: PrismaClientService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<true>;
}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { PrismaClientModule } from 'src/internals/database/prisma-client.module';
import { JwtModule } from 'src/internals/api/jwt.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [PrismaClientModule, JwtModule, EventModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

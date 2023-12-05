import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './internals/error-handling/all-exceptions.filter';
import { LoggingModule } from './internals/logging/logging.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [LoggingModule, AuthModule, MessageModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

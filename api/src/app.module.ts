import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { EventsModule } from './events/events.module';
import { PrismaClientService } from './internals/database/prisma-client.service';

@Module({
  imports: [AuthModule, MessageModule, EventsModule],
  controllers: [],
  providers: [PrismaClientService],
})
export class AppModule {}

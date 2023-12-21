import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { PrismaClientModule } from 'src/internals/database/prisma-client.module';
import { EventModule } from 'src/event/event.module';
import { PushNotificationModule } from 'src/internals/api/push-notification/push-notification.module';

@Module({
  controllers: [MessageController],
  imports: [PrismaClientModule, EventModule, PushNotificationModule],
})
export class MessageModule {}

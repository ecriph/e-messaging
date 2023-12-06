import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { PrismaClientModule } from 'src/internals/database/prisma-client.module';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [MessageController],
  imports: [PrismaClientModule, EventModule],
})
export class MessageModule {}

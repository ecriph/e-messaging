import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { PrismaClientModule } from 'src/internals/database/prisma-client.module';

@Module({
  imports: [PrismaClientModule],
  controllers: [MessageController],
})
export class MessageModule {}

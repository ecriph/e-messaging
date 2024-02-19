import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { PrismaClientModule } from 'src/internals/database/prisma-client.module';

@Module({
  providers: [EventGateway],
  imports: [PrismaClientModule],
  exports: [EventGateway],
})
export class EventModule {}

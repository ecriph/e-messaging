import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, MessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

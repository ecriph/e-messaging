import { Controller, Get, Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';

@Injectable()
@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private prisma: PrismaClientService) {}

  @Get('/create')
  async createMessage(): Promise<void> {}

  @Get('/previous/messages')
  async previousMessage(): Promise<void> {}

  @Get('/conversation/send')
  async sendMessage(): Promise<void> {}
}

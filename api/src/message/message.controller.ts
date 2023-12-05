import { Controller, Get } from '@nestjs/common';
import { AuthContext } from 'src/auth/auth-context';
import { WithAuthContext } from 'src/auth/auth-context.decorator';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly prisma: PrismaClientService) {}

  @Get('/list/conversation')
  async getConversations(@WithAuthContext() authContext: AuthContext) {
    const conversation = this.prisma.getClient().conversation.findMany({
      where: { userId: authContext.user.id },
      include: { messages: true },
    });

    return conversation;
  }

  //   @Get('/list/message')
  //   async getMessages(@WithAuthContext() authContext: AuthContext) {}

  //   @Post('/create/message')
  //   async createMessage(@WithAuthContext() authContext: AuthContext) {}

  //   @Post('/create/conversation')
  //   async createConversation(@WithAuthContext() authContext: AuthContext) {}
}

import { createConversationDTO } from '@/shared/messages/create-conversation/create-conversation.dto';
import { CreateConversationSchema } from '@/shared/messages/create-conversation/create-conversation.schemas';
// import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
// import { CreateMessageSchema } from '@/shared/messages/create-message/create-message.schemas';
import { ListMessageDTO } from '@/shared/messages/list-message/list-message.dto';
import { ListMessageSchema } from '@/shared/messages/list-message/list-message.schemas';
import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { Conversation, Message } from '@prisma/client';
import { AuthContext } from 'src/auth/auth-context';
import { WithAuthContext } from 'src/auth/auth-context.decorator';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { ResourceNotFoundException } from 'src/internals/server/resource-not-found.exception';
import { ValidationPipe } from 'src/internals/validation/validation.pipe';

const lastMessage = (conversation: Conversation & { messages: Message[] }) => {
  return {
    ...conversation,
    messages:
      conversation.messages.length > 0
        ? conversation.messages[conversation.messages.length - 1]
        : [],
  };
};

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly prisma: PrismaClientService) {}

  @Get('/list/users')
  async getUsers(@WithAuthContext() authContext: AuthContext) {
    const users = await this.prisma.getClient().user.findMany({
      include: { messages: true, conversations: true },
    });

    const filteredUsers = users.filter(
      (user) => user.id !== authContext.user.id,
    );

    return filteredUsers;
  }
  @Get('/list/conversation')
  async getConversations(@WithAuthContext() authContext: AuthContext) {
    const conversation = this.prisma.getClient().conversation.findMany({
      where: {
        OR: [
          { userId: authContext.user.id },
          { recipientId: authContext.user.id },
        ],
      },
      include: { messages: true },
    });

    const conversationsWithLastMessage = (await conversation).map(lastMessage);

    return conversationsWithLastMessage;
  }

  @Get('/list/rtoken/:conversationId')
  async getToken(
    @WithAuthContext() authContext: AuthContext,
    @Param(new ValidationPipe(ListMessageSchema)) listMessage: ListMessageDTO,
  ) {
    return this.prisma.getClient().$transaction(async (tx) => {
      const getMessages = await tx.conversation.findFirst({
        where: {
          id: listMessage.conversationId,
        },
      });

      if (!getMessages)
        throw new ResourceNotFoundException('Convo does not exist');

      if (getMessages.userId !== authContext.user.id) {
        const getToken = await tx.pushToken.findFirst({
          where: { userId: getMessages.userId },
        });

        return getToken?.token;
      } else if (getMessages.recipientId !== authContext.user.id) {
        const getToken = await tx.pushToken.findFirst({
          where: { userId: getMessages.recipientId },
        });

        return getToken?.token;
      }
      Logger.log(authContext.user.id);
    });
  }

  @Get('/list/message/:conversationId')
  async getMessages(
    @WithAuthContext() authContext: AuthContext,
    @Param(new ValidationPipe(ListMessageSchema)) listMessage: ListMessageDTO,
  ) {
    const getMessages = await this.prisma.getClient().message.findMany({
      where: {
        conversationId: listMessage.conversationId,
      },
    });

    return getMessages;
  }

  @Post('/create/conversation')
  async createConversation(
    @WithAuthContext() authContext: AuthContext,
    @Body(new ValidationPipe(CreateConversationSchema))
    createConversation: createConversationDTO,
  ) {
    return await this.prisma.getClient().$transaction(async (tx) => {
      //check if conversation exist with recipient if not create new
      const checkIfConversationExist = await tx.conversation.findFirst({
        where: {
          OR: [
            { userId: authContext.user.id },
            { recipientId: authContext.user.id },
            { userId: createConversation.recipientId },
            { recipientId: createConversation.recipientId },
          ],
        },
      });

      if (checkIfConversationExist) return checkIfConversationExist;

      const conversation = await this.prisma.getClient().conversation.create({
        data: {
          userId: authContext.user.id,
          recipientId: createConversation.recipientId,
          userName: createConversation.userName,
          recipientName: createConversation.recipientName,
        },
        include: { messages: true },
      });

      return conversation;
    });
  }
}

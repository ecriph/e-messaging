import { createConversationDTO } from '@/shared/messages/create-conversation/create-conversation.dto';
import { CreateConversationSchema } from '@/shared/messages/create-conversation/create-conversation.schemas';
import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { CreateMessageSchema } from '@/shared/messages/create-message/create-message.schemas';
import { ListMessageDTO } from '@/shared/messages/list-message/list-message.dto';
import { ListMessageSchema } from '@/shared/messages/list-message/list-message.schemas';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Conversation, Message } from '@prisma/client';
import { AuthContext } from 'src/auth/auth-context';
import { WithAuthContext } from 'src/auth/auth-context.decorator';
import { EventGateway } from 'src/event/event.gateway';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
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
  constructor(
    private readonly prisma: PrismaClientService,
    private readonly event: EventGateway,
  ) {}

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

  @Post('/create/message')
  async createMessage(
    @WithAuthContext() authContext: AuthContext,
    @Body(new ValidationPipe(CreateMessageSchema))
    sendMessage: CreateMessageDTO,
  ) {
    const message = await this.prisma.getClient().message.create({
      data: {
        content: sendMessage.content,
        senderId: authContext.user.id,
        conversationId: sendMessage.conversationId,
      },
    });

    this.event.sendMessage(message);

    return message;
  }

  @Post('/create/conversation')
  async createConversation(
    @WithAuthContext() authContext: AuthContext,
    @Body(new ValidationPipe(CreateConversationSchema))
    createConversation: createConversationDTO,
  ) {
    const conversation = await this.prisma.getClient().conversation.create({
      data: {
        userId: authContext.user.id,
        recipientId: createConversation.recipientId,
      },
      include: { messages: true },
    });

    return conversation;
  }
}

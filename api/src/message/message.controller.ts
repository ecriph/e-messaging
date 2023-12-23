import { createConversationDTO } from '@/shared/messages/create-conversation/create-conversation.dto';
import { CreateConversationSchema } from '@/shared/messages/create-conversation/create-conversation.schemas';
import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { CreateMessageSchema } from '@/shared/messages/create-message/create-message.schemas';
import { ListMessageDTO } from '@/shared/messages/list-message/list-message.dto';
import { ListMessageSchema } from '@/shared/messages/list-message/list-message.schemas';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Conversation, Message, User } from '@prisma/client';
import { AuthContext } from 'src/auth/auth-context';
import { WithAuthContext } from 'src/auth/auth-context.decorator';
import { EventGateway } from 'src/event/event.gateway';
import { PushNotificationService } from 'src/internals/api/push-notification/push-notification.service';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { ResourceNotFoundException } from 'src/internals/server/resource-not-found.exception';
import { ValidationPipe } from 'src/internals/validation/validation.pipe';

function lastMessage(conversation: Conversation & { messages: Message[] }) {
  return {
    ...conversation,
    messages:
      conversation.messages.length > 0
        ? conversation.messages[conversation.messages.length - 1]
        : [],
  };
}

function getUserNameRow(names: User[], userId: string) {
  const filteredName = names.find((user) => user.id === userId);
  return filteredName ? filteredName.fullname : '';
}

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(
    private readonly prisma: PrismaClientService,
    private readonly event: EventGateway,
    private readonly sendNotification: PushNotificationService,
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
    return await this.prisma.getClient().$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          content: sendMessage.content,
          senderId: authContext.user.id,
          conversationId: sendMessage.conversationId,
        },
      });

      const conversation = await tx.conversation.findFirst({
        where: { id: sendMessage.conversationId },
      });
      if (!conversation) return;
      const recipient =
        conversation.userId === authContext.user.id
          ? { id: conversation.userId, username: conversation.userName }
          : {
              id: conversation.recipientId,
              username: conversation.recipientName,
            };

      const getToken = await tx.pushToken.findUnique({
        where: { userId: recipient.id },
      });

      if (!getToken) return new ResourceNotFoundException();

      // const pushToken: string[] = [getToken.token];

      await this.sendNotification.sendPushNotification(
        getToken.token,
        sendMessage.content,
      );

      return message;
    });
  }

  @Post('/create/conversation')
  async createConversation(
    @WithAuthContext() authContext: AuthContext,
    @Body(new ValidationPipe(CreateConversationSchema))
    createConversation: createConversationDTO,
  ) {
    return this.prisma.getClient().$transaction(async (tx) => {
      const checkDuplicate = await tx.conversation.findFirst({
        where: {
          OR: [
            {
              userId: authContext.user.id,
              recipientId: createConversation.recipientId,
            },
            {
              userId: createConversation.recipientId,
              recipientId: authContext.user.id,
            },
          ],
        },
        include: { messages: true },
      });

      if (checkDuplicate) {
        return checkDuplicate;
      }

      const getNames = await tx.user.findMany({
        where: {
          OR: [
            { id: authContext.user.id },
            { id: createConversation.recipientId },
          ],
        },
      });

      const userName = getUserNameRow(getNames, authContext.user.id);
      const recipientName = getUserNameRow(
        getNames,
        createConversation.recipientId,
      );

      const conversation = await tx.conversation.create({
        data: {
          userId: authContext.user.id,
          recipientId: createConversation.recipientId,
          recipientName: recipientName,
          userName: userName,
        },
        include: { messages: true },
      });

      return conversation;
    });
  }
}

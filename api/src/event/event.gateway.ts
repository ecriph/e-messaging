import {
  OnGatewayInit,
  SubscribeMessage,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { TypingDTO } from '@/shared/messages/message-typing/typing.dto';
import { Conversation, Message } from '@prisma/client';

const lastMessage = (conversation: Conversation & { messages: Message[] }) => {
  return {
    ...conversation,
    messages:
      conversation.messages.length > 0
        ? conversation.messages[conversation.messages.length - 1]
        : [],
  };
};

@WebSocketGateway({ namespace: 'events' })
export class EventGateway implements OnGatewayInit {
  @WebSocketServer()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly server!: Server;
  constructor(private readonly prisma: PrismaClientService) {}

  afterInit() {
    Logger.log('afterinit');
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, data: CreateMessageDTO) {
    await socket.join(data.conversationId);
    await this.prisma.getClient().$transaction(async (tx) => {
      await tx.message.create({
        data: {
          content: data.content,
          senderId: data.userId,
          conversationId: data.conversationId,
          category: data.category,
        },
      });

      const getMessages = await tx.message.findMany({
        where: {
          conversationId: data.conversationId,
        },
      });

      this.server.to(data.conversationId).emit('receiveMessage', getMessages);
      // this.server.emit('lastMessage', data.content);
    });
  }

  @SubscribeMessage('listConvo')
  async handleConvoList(socket: Socket, data: { userId: string }) {
    const conversation = this.prisma.getClient().conversation.findMany({
      where: {
        OR: [{ userId: data.userId }, { recipientId: data.userId }],
      },
      include: { messages: true },
    });

    const conversationsWithLastMessage = (await conversation).map(lastMessage);

    this.server.emit('conversationList', conversationsWithLastMessage);
  }

  @SubscribeMessage('onType')
  async handleTyping(socket: Socket, data: TypingDTO) {
    await socket.join(data.conversationId);
    const response = { message: `${data.username} is typing`, id: data.userId };
    this.server.to(data.conversationId).emit('typingResponse', response);
  }
}

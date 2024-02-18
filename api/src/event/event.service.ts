import { createConversationDTO } from '@/shared/messages/create-conversation/create-conversation.dto';
import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { ListMessageDTO } from '@/shared/messages/list-message/list-message.dto';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaClientService) {}
  handleConnection(socket: Socket) {
    socket.on('newMessage', async (data: CreateMessageDTO) => {
      await this.prisma.getClient().$transaction(async (tx) => {
        const message = tx.message.create({
          data: {
            content: data.content,
            senderId: data.userId,
            conversationId: data.conversationId,
          },
        });

        const allmessage = await tx.message.findMany({
          where: {
            conversationId: data.conversationId,
          },
        });

        socket.to(data.conversationId).emit('convoMessage', message);
        socket.emit('foundConverstaion', allmessage);
      });
    });

    socket.on('findConversation', async (data: ListMessageDTO) => {
      const messages = await this.prisma.getClient().message.findMany({
        where: {
          conversationId: data.conversationId,
        },
      });
      socket.emit('foundConverstaion', messages);
    });

    socket.on('createConversation', async (data: createConversationDTO) => {
      await this.prisma.getClient().$transaction(async (tx) => {
        const response = await tx.conversation.create({
          data: {
            recipientId: data.recipientId,
            recipientName: data.recipientName,
            userName: data.userName,
            userId: data.userId,
          },
        });
        await socket.join(response.id);
        const conversation = tx.conversation.findMany({
          where: {
            OR: [{ userId: data.userId }, { recipientId: data.userId }],
          },
          include: { messages: true },
        });

        socket.emit('conversationList', conversation);
      });
    });

    socket.on('disconnect', () => {
      return { status: 'disconnected' };
    });
  }
}

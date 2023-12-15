import {
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvent } from './types/events';
import { MessageDTO } from '@/shared/messages/message.dto';
// import { UserStatus } from '@/shared/users/user-login/user-status.dto';

@WebSocketGateway({ namespace: 'events' })
export class EventGateway {
  @WebSocketServer()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly server!: Server<any, ServerToClientEvent>;
  private connectedUsers: Set<string> = new Set();
  private unreadMessageCounts: Map<string, number> = new Map();

  // handleConnection(status: UserStatus) {
  //   this.connectedUsers.add(status.userId);
  //   // Notify frontend about online status
  //   this.server.emit('onlineStatus', status);
  // }

  // handleDisconnect(status: UserStatus) {
  //   this.connectedUsers.delete(status.userId);
  //   // Notify frontend about offline status
  //   this.server.emit('onlineStatus', status);
  // }
  sendMessage(message: MessageDTO) {
    this.server.emit('newMessage', message);
  }

  // handleTyping(status: UserStatus): void {
  //   // Notify frontend about typing status
  //   this.server.emit('typingStatus', status);
  // }

  handleMessage(client: any, payload: any): void {
    // Handle incoming messages
    // For simplicity, let's assume payload contains information about the message
    const { convoId } = payload;

    // Update unread message count for the user
    this.updateUnreadMessageCount(convoId);

    // Notify frontend about the updated unread message count
    this.sendUnreadMessageCount(convoId);
  }

  private updateUnreadMessageCount(userId: string): void {
    const currentCount = this.unreadMessageCounts.get(userId) || 0;
    this.unreadMessageCounts.set(userId, currentCount + 1);
  }

  private sendUnreadMessageCount(userId: string): void {
    const unreadCount = this.unreadMessageCounts.get(userId) || 0;
    // Send the unread message count to the client
    this.server.to(userId).emit('unreadMessageCount', { count: unreadCount });
  }
}

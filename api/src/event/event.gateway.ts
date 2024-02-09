import {
  OnGatewayInit,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvent } from './types/events';
import { MessageDTO } from '@/shared/messages/message.dto';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'events' })
export class EventGateway implements OnGatewayInit {
  @WebSocketServer()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly server!: Server<any, ServerToClientEvent>;

  afterInit() {
    Logger.log('afterinit');
  }

  sendMessage(message: MessageDTO) {
    this.server.emit('newMessage', message);
  }

  handleTyping(status: UserStatus) {
    // Notify frontend about typing status
    this.server.emit('typingStatus', status);
  }
}

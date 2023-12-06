import {
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvent } from './types/events';
import { MessageDTO } from '@/shared/messages/message.dto';

@WebSocketGateway({ namespace: 'events' })
export class EventGateway {
  @WebSocketServer()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly server!: Server<any, ServerToClientEvent>;

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  sendMessage(message: MessageDTO) {
    this.server.emit('newMessage', message);
  }
}

import {
  OnGatewayInit,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvent } from './types/events';
// import { MessageDTO } from '@/shared/messages/message.dto';
import { Logger } from '@nestjs/common';
import { EventService } from './event.service';

@WebSocketGateway({ namespace: 'events' })
export class EventGateway implements OnGatewayInit {
  @WebSocketServer()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly server!: Server<any, ServerToClientEvent>;
  constructor(private readonly socketService: EventService) {}

  afterInit() {
    Logger.log('afterinit');
  }

  handleConnection(socket: Socket) {
    this.socketService.handleConnection(socket);
  }
}

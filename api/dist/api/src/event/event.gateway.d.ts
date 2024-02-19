import { OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { TypingDTO } from '@/shared/messages/message-typing/typing.dto';
export declare class EventGateway implements OnGatewayInit {
    private readonly prisma;
    private readonly server;
    constructor(prisma: PrismaClientService);
    afterInit(): void;
    handleMessage(socket: Socket, data: CreateMessageDTO): Promise<void>;
    handleConvoList(socket: Socket, data: {
        userId: string;
    }): Promise<void>;
    handleTyping(socket: Socket, data: TypingDTO): Promise<void>;
}

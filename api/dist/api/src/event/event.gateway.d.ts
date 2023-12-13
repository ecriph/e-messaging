import { MessageDTO } from '@/shared/messages/message.dto';
export declare class EventGateway {
    private readonly server;
    sendMessage(message: MessageDTO): void;
}

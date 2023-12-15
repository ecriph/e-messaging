import { MessageDTO } from '@/shared/messages/message.dto';
export declare class EventGateway {
    private readonly server;
    private connectedUsers;
    private unreadMessageCounts;
    sendMessage(message: MessageDTO): void;
    handleMessage(client: any, payload: any): void;
    private updateUnreadMessageCount;
    private sendUnreadMessageCount;
}

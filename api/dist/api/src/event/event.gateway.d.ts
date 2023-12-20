import { MessageDTO } from '@/shared/messages/message.dto';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';
export declare class EventGateway {
    private readonly server;
    private connectedUsers;
    private unreadMessageCounts;
    handleConnection(status: UserStatus): void;
    sendMessage(message: MessageDTO): void;
    handleTyping(status: UserStatus): void;
    handleMessage(client: any, payload: any): void;
    private updateUnreadMessageCount;
    private sendUnreadMessageCount;
}

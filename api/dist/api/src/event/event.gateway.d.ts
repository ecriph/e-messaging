import { OnGatewayInit } from '@nestjs/websockets';
import { MessageDTO } from '@/shared/messages/message.dto';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';
export declare class EventGateway implements OnGatewayInit {
    private readonly server;
    afterInit(): void;
    sendMessage(message: MessageDTO): void;
    handleTyping(status: UserStatus): void;
}

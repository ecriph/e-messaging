import { ConversationDTO } from '../../messages/conversation.dto';
import { MessageDTO } from '../../messages/message.dto';
export declare class UserLoginDTO {
    email: string;
    password: string;
}
export declare class UserLoginResponseDTO {
    token: string;
    refresh_token: string;
    messages: MessageDTO[];
    conversations: ConversationDTO[];
    fullname: string;
    userId: string;
}

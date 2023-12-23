import { ConversationDTO } from '../../messages/conversation.dto';
export declare class UserLoginDTO {
    email: string;
    password: string;
}
export declare class UserLoginResponseDTO {
    token: string;
    refresh_token: string;
    conversations: ConversationDTO[];
    fullname: string;
    userId: string;
}

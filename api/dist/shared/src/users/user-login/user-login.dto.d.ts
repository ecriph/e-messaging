import { ConversationDTO } from '../../messages/conversation.dto';
export declare class UserLoginDTO {
    email: string;
    password: string;
}
export declare class UserLoginResponseDTO {
    access_token: string;
    refresh_token: string;
    conversation: ConversationDTO[];
    fullname: string;
    userId: string;
}

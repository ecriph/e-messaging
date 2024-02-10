import { ConversationDTO } from '../../messages/conversation.dto';
export declare class UserRegisterDTO {
    fullname: string;
    password: string;
    phone: string;
    email: string;
}
export declare class UserRegisterResponseDTO {
    access_token: string;
    refresh_token: string;
    userId: string;
    conversation: ConversationDTO[];
    fullname: string;
}

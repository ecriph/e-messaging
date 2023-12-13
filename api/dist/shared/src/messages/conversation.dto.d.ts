import { MessageDTO } from './message.dto';
export declare class ConversationDTO {
    id: string;
    userId: string;
    recipientId: string;
    createdAt: Date;
}
export declare class ConversationResponseListDTO {
    id: string;
    userId: string;
    recipientId: string;
    messages: MessageDTO;
    createdAt: Date;
}

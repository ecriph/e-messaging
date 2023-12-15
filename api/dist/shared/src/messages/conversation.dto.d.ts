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
    recipientName: string;
    userName: string;
    messages: MessageDTO;
    createdAt: Date;
    updatedAt: Date;
}

import { UserWithOutPassword } from '../users/user.dto';
import { MessageDTO } from './message.dto';
export declare class ChatScreenDTO {
    id: string;
    messages: MessageDTO[];
    users: UserWithOutPassword;
}

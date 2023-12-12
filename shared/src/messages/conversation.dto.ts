import { UserWithOutPassword } from '../users/user.dto';
import { MessageDTO } from './message.dto';

export class ConversationDTO {
  id!: string;
  userId!: string;
  recipientId!: string;
  createdAt!: Date;
}

export class ConversationResponseListDTO {
  id!: string;
  userId!: string;
  recipientId!: string;
  messages!: MessageDTO;
  createdAt!: Date;
}

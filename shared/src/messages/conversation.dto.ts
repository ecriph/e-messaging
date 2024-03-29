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
  recipientName!: string;
  userName!: string;
  messages!: MessageDTO;
  createdAt!: Date;
  updatedAt!: Date;
}

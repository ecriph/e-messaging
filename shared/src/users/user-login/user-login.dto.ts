import { ConversationDTO } from '../../messages/conversation.dto';
import { MessageDTO } from '../../messages/message.dto';

export class UserLoginDTO {
  email!: string;
  password!: string;
}

export class UserLoginResponseDTO {
  access_token!: string;
  refresh_token!: string;
  conversation!: ConversationDTO[];
  fullname!: string;
  userId!: string;
}

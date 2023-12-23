import { ConversationDTO } from '../../messages/conversation.dto';
import { MessageDTO } from '../../messages/message.dto';

export class UserLoginDTO {
  email!: string;
  password!: string;
}

export class UserLoginResponseDTO {
  token!: string;
  refresh_token!: string;
  conversations!: ConversationDTO[];
  fullname!: string;
  userId!: string;
}

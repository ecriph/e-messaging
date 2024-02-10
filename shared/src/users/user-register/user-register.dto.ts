import { ConversationDTO } from '../../messages/conversation.dto';

export class UserRegisterDTO {
  fullname!: string;
  password!: string;
  phone!: string;
  email!: string;
}

export class UserRegisterResponseDTO {
  access_token!: string;
  refresh_token!: string;
  userId!: string;
  conversation!: ConversationDTO[];
  fullname!: string;
}

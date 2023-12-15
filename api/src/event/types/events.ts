import { MessageDTO } from '@/shared/messages/message.dto';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';

export interface ServerToClientEvent {
  newMessage: (payload: MessageDTO) => void;
  typingStatus: (payload: UserStatus) => void;
  onlineStatus: (payload: UserStatus) => void;
  unreadMessageCount: (payload: { count: number }) => void;
}

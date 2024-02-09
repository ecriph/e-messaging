import { MessageDTO } from '@/shared/messages/message.dto';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';
import { Socket } from 'socket.io';

export interface ServerToClientEvent {
  newMessage: (payload: MessageDTO) => void;
  typingStatus: (payload: UserStatus) => void;
  onlineStatus: (payload: UserStatus) => void;
  unreadMessageCount: (payload: { count: number }) => void;
}

export interface CustomSocket extends Socket {
  userId: string;
}

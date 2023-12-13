import { MessageDTO } from '@/shared/messages/message.dto';

export interface ServerToClientEvent {
  newMessage: (payload: MessageDTO) => void;
}

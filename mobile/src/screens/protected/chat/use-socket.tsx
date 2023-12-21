import { MessageDTO } from '@/shared/messages/message.dto';
import { useEffect } from 'react';
import io from 'socket.io-client';
import { EnvironmentVariables } from '../../../internals/runtime/environment-vairables';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';

const SOCKET_SERVER_URL = EnvironmentVariables.MAIN_API_URL + '/events';

export const useUnreadMessage = (
  convoId: string,
  onUnreadMessageCount: (count: string) => void
) => {
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { query: { convoId } });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    socket.on('unreadMessageCount', (count) => {
      onUnreadMessageCount(count);
    });
    return () => {
      socket.disconnect();
    };
  }, [convoId, onUnreadMessageCount]);
};

const useWebSocket = (
  userId: string,
  onMessage: (message: MessageDTO) => void,
  onTypingStatus: (status: UserStatus) => void
) => {
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { query: { userId } });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('newMessage', (message) => {
      onMessage(message);
    });

    socket.on('typingStatus', (status) => {
      onTypingStatus(status);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, onMessage, onTypingStatus]);
};

export default useWebSocket;

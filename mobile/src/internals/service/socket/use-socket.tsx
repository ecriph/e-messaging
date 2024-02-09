import { MessageDTO } from '@/shared/messages/message.dto';
import { useEffect, useState } from 'react';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';
import socket from './socket-services';
import { useAppSelector } from '../../../redux/hooks';

const useWebSocket = (
  onMessage: (message: MessageDTO) => void,
  onTypingStatus: (status: UserStatus) => void
) => {
  const [status, setStatus] = useState();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('newMessage', (message) => {
      setStatus(message);
      onMessage(message);
    });

    socket.on('typingStatus', (status) => {
      onTypingStatus(status);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, status, onMessage, onTypingStatus]);
};

export default useWebSocket;

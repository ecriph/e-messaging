import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import {
  FlexColumnContainer,
  FlexRowContainer,
} from '../../../../internals/ui-kit/container';

import { SenderMesssage } from './chat-send';
import { ReceiverMessage } from './chat-recieve';

export const ChatContainer = ({
  chatMessage,
  id,
}: {
  chatMessage: CreateChatMessageDTO[];
  id: string;
}) => {
  return (
    <>
      {chatMessage.map((message, index: number) => {
        const isOwnMessage = message.senderId === id;

        return (
          <FlexColumnContainer key={index}>
            {isOwnMessage ? (
              <FlexRowContainer justifyContent="flex-end">
                <SenderMesssage
                  text={message.content}
                  name="You"
                  date={message.createdAt}
                />
              </FlexRowContainer>
            ) : (
              <FlexRowContainer justifyContent="flex-start">
                <ReceiverMessage
                  text={message.content}
                  name={message.senderId}
                  date={message.createdAt}
                />
              </FlexRowContainer>
            )}
          </FlexColumnContainer>
        );
      })}
    </>
  );
};

import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import {
  FlexColumnContainer,
  FlexRowContainer,
  FlexRowRecieveChat,
  FlexRowSendChat,
} from '../../../internals/ui-kit/container';
import { HeaderText1, SmallText } from '../../../internals/ui-kit/text';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import { useTimeFormat } from '../../../internals/utils/use-date-time';

const ReceiverMessage = ({
  text,
  date,
  name,
}: {
  text: string;
  date: Date;
  name: string;
}) => {
  return (
    <FlexColumnContainer>
      <FlexRowRecieveChat
        align="center"
        justifyContent="flex-start"
        mt="2px"
        mb="2px"
      >
        <HeaderText1 color={Colors.black} font={Font.Medium}>
          {text}
        </HeaderText1>
      </FlexRowRecieveChat>
      <FlexRowContainer justifyContent="flex-start">
        <HeaderText1
          fontSize={FontSize.normal1}
          font={Font.Medium}
          color={Colors.grey}
        >
          {useTimeFormat(date)}
        </HeaderText1>
      </FlexRowContainer>
    </FlexColumnContainer>
  );
};
const SenderMesssage = ({
  text,
  date,
  name,
}: {
  text: string;
  date: Date;
  name: string;
}) => {
  return (
    <FlexColumnContainer>
      <FlexRowSendChat
        align="center"
        justifyContent="flex-end"
        mt="2px"
        mb="2px"
      >
        <HeaderText1 color={Colors.black} font={Font.Medium}>
          {text}
        </HeaderText1>
      </FlexRowSendChat>
      <FlexRowContainer justifyContent="flex-end">
        <HeaderText1
          font={Font.Medium}
          color={Colors.grey}
          fontSize={FontSize.normal1}
        >
          {useTimeFormat(date)}
        </HeaderText1>
      </FlexRowContainer>
    </FlexColumnContainer>
  );
};

const ChatContainer = ({
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

export { ReceiverMessage, SenderMesssage, ChatContainer };

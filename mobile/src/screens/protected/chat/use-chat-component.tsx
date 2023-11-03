import {
  FlexColumnContainer,
  FlexRowContainer,
  FlexRowRecieveChat,
  FlexRowSendChat,
} from '../../../internals/ui-kit/container';
import { HeaderText1 } from '../../../internals/ui-kit/text';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import { useTimeFormat } from '../../../internals/utils/use-date-time';
import { ChatState } from '../../../redux/chat/reducer';

const ReceiverMessage = ({
  text,
  date,
  name,
}: {
  text: string;
  date: number;
  name: string;
}) => {
  return (
    <FlexColumnContainer>
      <FlexRowContainer justifyContent="flex-start">
        <HeaderText1 font={Font.Medium} color={Colors.grey}>
          {name}
        </HeaderText1>
      </FlexRowContainer>
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
  date: number;
  name: string;
}) => {
  return (
    <FlexColumnContainer>
      <FlexRowContainer justifyContent="flex-end">
        <HeaderText1 font={Font.Medium} color={Colors.grey}>
          {name}
        </HeaderText1>
      </FlexRowContainer>
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
  chatMessage: ChatState;
  id: string;
}) => {
  const messages = chatMessage.chatMessage;
  return (
    <>
      {messages.length === 0 ? (
        <FlexColumnContainer align="center">
          <HeaderText1 font={Font.Light} fontSize={FontSize.small}>
            No messages yet with user
          </HeaderText1>
        </FlexColumnContainer>
      ) : (
        messages.map((message, index: number) => (
          <FlexColumnContainer key={index}>
            {message.id === id ? (
              <FlexRowContainer justifyContent="flex-end">
                <SenderMesssage
                  text={message.message}
                  name="You"
                  date={message.date}
                />
              </FlexRowContainer>
            ) : (
              <FlexRowContainer justifyContent="flex-start">
                <ReceiverMessage
                  text={message.message}
                  name={message.name}
                  date={message.date}
                />
              </FlexRowContainer>
            )}
          </FlexColumnContainer>
        ))
      )}
    </>
  );
};

export { ReceiverMessage, SenderMesssage, ChatContainer };

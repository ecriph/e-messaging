import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import {
  FlexColumnContainer,
  FlexRowContainer,
  FlexRowRecieveChat,
  FlexRowSendChat,
} from '../../../../internals/ui-kit/container';
import { HeaderText1, SmallText } from '../../../../internals/ui-kit/text';
import { Colors, Font, FontSize } from '../../../../internals/ui-kit/theme';
import { useTimeFormat } from '../../../../internals/utils/use-date-time';

export const SenderMesssage = ({
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

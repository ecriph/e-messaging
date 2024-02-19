import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import {
  FlexColumnContainer,
  FlexRowContainer,
  FlexRowRecieveChat,
  FlexRowSendChat,
  ImageWrap,
} from '../../../../internals/ui-kit/container';
import { HeaderText1, SmallText } from '../../../../internals/ui-kit/text';
import { Colors, Font, FontSize } from '../../../../internals/ui-kit/theme';
import { useTimeFormat } from '../../../../internals/utils/use-date-time';

export const ReceiverMessage = ({
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

export const ReceiverPhoto = ({
  url,
  date,
  name,
}: {
  url: string;
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
        <ImageWrap
          source={{ uri: url }}
          resizeMode="contain"
          height={200}
          width={180}
        />
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

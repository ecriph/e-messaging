import React from 'react';
import {
  Circle,
  FlexColumnContainer,
  FlexRowContainer,
  FlexRowRecieveChat,
  MainContainer,
} from '../../../internals/ui-kit/container';
import { HeaderText1 } from '../../../internals/ui-kit/text';
import { PrimaryInput } from '../../../internals/ui-kit/input';
import { ChatButton } from '../../../internals/ui-kit/button';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import BackArrow from '../../../internals/ui-kit/back-arrow';
import { FontAwesome } from '@expo/vector-icons';

type Props = {};

const ReceiverChat = ({ text }: { text: string }) => {
  return (
    <FlexRowRecieveChat align="center" justifyContent="flex-start">
      <HeaderText1 color={Colors.black} font={Font.Medium}>
        {text}
      </HeaderText1>
    </FlexRowRecieveChat>
  );
};

const ChatScreen = (props: Props) => {
  return (
    <MainContainer
      BottomComponent={
        <FlexRowContainer align="center" justifyContent="space-between">
          <PrimaryInput
            style={{ width: '80%' }}
            text=""
            placeholder="Enter text here"
            value={'Hello'}
            onChangeText={() => {}}
            fontSize={FontSize.header1}
          />
          <ChatButton width="15%" mb="0px" onPress={() => {}} />
        </FlexRowContainer>
      }
    >
      <FlexColumnContainer>
        <FlexRowContainer justifyContent="space-between">
          <FlexColumnContainer>
            <FlexRowContainer justifyContent="space-between" align="center">
              <BackArrow />
              <Circle width="24px" height="24px" bg={Colors.offwhite}>
                <FontAwesome
                  name="user-circle-o"
                  size={24}
                  color={Colors.grey}
                />
              </Circle>
              <HeaderText1 font={Font.Medium} ml="10px">
                Username
              </HeaderText1>
            </FlexRowContainer>
          </FlexColumnContainer>
          <FlexColumnContainer>
            <HeaderText1>Chat Screen</HeaderText1>
          </FlexColumnContainer>
        </FlexRowContainer>

        <ReceiverChat text="Hello this is Prince" />
      </FlexColumnContainer>
    </MainContainer>
  );
};

export default ChatScreen;

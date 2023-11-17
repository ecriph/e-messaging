import React from 'react';
import {
  Circle,
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
  PressableContainer,
} from '../../../internals/ui-kit/container';
import {
  HeaderText1,
  HeaderText2,
  HeaderText3,
  NormalText,
} from '../../../internals/ui-kit/text';
import { FontAwesome } from '@expo/vector-icons';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Divider } from '../../../internals/ui-kit/divider';

interface DashboardProps {}
interface ChatProps {
  onPress: () => void;
  // userName: string;
  // timeStamp: string;
  // lastMessage: string;
  // indicator: number;
}

const ChatList = ({ onPress }: ChatProps) => {
  return (
    <PressableContainer onPress={onPress}>
      <FlexRowContainer justifyContent="flex-start" align="center" mb="20px">
        <FlexColumnContainer mr="10px" align="flex-start">
          <Circle width="30px" height="30px" bg={Colors.offwhite}>
            <FontAwesome name="user-circle-o" size={30} color={Colors.grey} />
          </Circle>
        </FlexColumnContainer>
        <FlexColumnContainer
          mr="60px"
          justifyContent="flex-start"
          align="flex-start"
        >
          <HeaderText1 lineHeight="25px">UserName</HeaderText1>
          <HeaderText1 lineHeight="25px" color={Colors.grey} font={Font.Light}>
            This is a sample chat with prince
          </HeaderText1>
        </FlexColumnContainer>
        <FlexColumnContainer justifyContent="space-evenly" align="flex-end">
          <NormalText lineHeight="25px" color={Colors.grey}>
            12:00pm
          </NormalText>
          <Circle width="20px" height="20px">
            <HeaderText1 lineHeight="20px" fontSize={FontSize.normal2}>
              1
            </HeaderText1>
          </Circle>
        </FlexColumnContainer>
      </FlexRowContainer>
    </PressableContainer>
  );
};

const DashboardScreen = (props: DashboardProps) => {
  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  return (
    <MainContainer>
      <FlexRowContainer justifyContent="space-between" align="center">
        <FlexColumnContainer>
          <HeaderText2>eChatApp</HeaderText2>
        </FlexColumnContainer>
        <FlexColumnContainer>
          <PressableContainer
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Circle width="24px" height="24px" bg={Colors.offwhite}>
              <FontAwesome name="user-circle-o" size={24} color={Colors.grey} />
            </Circle>
          </PressableContainer>
        </FlexColumnContainer>
      </FlexRowContainer>
      <FlexRowContainer mb="20px" justifyContent="flex-start">
        <HeaderText1 color={Colors.grey} font={Font.Regular}>
          Hi, Prince
        </HeaderText1>
      </FlexRowContainer>
      <FlexColumnContainer>
        <HeaderText3 mb="20px">My Chats</HeaderText3>
        {/* <Divider /> */}
        <ChatList onPress={() => navigation.navigate('ChatScreen')} />
        <Divider />
      </FlexColumnContainer>
    </MainContainer>
  );
};

export default DashboardScreen;

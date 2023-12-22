import React, { useEffect, useState } from 'react';
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
  SmallText,
} from '../../../internals/ui-kit/text';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Divider } from '../../../internals/ui-kit/divider';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Category } from '../../../internals/data/conversation';
import { FontAwesome } from '@expo/vector-icons';
import { ChatList } from './use-dashboard-chat-list';
import { UsersList } from './use-dashboard-user-list';
import { LOGOUT_USER } from '../../../redux/user/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMainApi } from '../../../internals/api/use-main-request';

interface DashboardProps {}

interface ChatProps {
  onPress: () => void;
  // userName: string;
  // timeStamp: string;
  // lastMessage: string;
  // indicator: number;
}

enum CategoryList {
  USERS = 'Users',
  CHATS = 'Chats',
}

const DashboardScreen = (props: DashboardProps) => {
  const [selected, setSelected] = useState<string>(CategoryList.CHATS);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { postRequest } = useMainApi();

  const registerToken = async () => {
    if (!user?.token) {
      console.log('User token is missing.');
      return;
    }

    try {
      const payload = { token: user?.token };
      const response = await postRequest('/auth/register-token', payload);

      console.log('Push token:', user?.token);
      console.log('Failed push token:', response.failure);

      return response;
    } catch (err) {
      console.error(
        'Error in registering the device for push notifications:',
        err
      );
      throw err; // Propagate the error for better error handling if needed
    }
  };

  useEffect(() => {
    registerToken()
      .then((response) => {
        // Handle the response if needed
      })
      .catch((error) => {
        // Handle the error if needed
      });
  }, []);

  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  return (
    <MainContainer>
      <FlexRowContainer mt="40px" justifyContent="space-between" align="center">
        <FlexColumnContainer>
          <HeaderText2 font={Font.Bold}>eChatApp</HeaderText2>
        </FlexColumnContainer>
        <FlexColumnContainer>
          <PressableContainer
            onPress={() => {
              dispatch(LOGOUT_USER());
              AsyncStorage.clear();
            }}
          >
            <SmallText fontSize={12} color={Colors.error} font={Font.SemiBold}>
              Logout
            </SmallText>
          </PressableContainer>
        </FlexColumnContainer>
      </FlexRowContainer>
      <FlexRowContainer mt="20px" justifyContent="space-between">
        <HeaderText3 font={Font.SemiBold} mb="20px">
          Conversations
        </HeaderText3>
        <HeaderText1 color={Colors.grey} font={Font.Medium}>
          Hi, {user.fullname}
        </HeaderText1>
      </FlexRowContainer>
      <FlexColumnContainer>
        <FlexRowContainer justifyContent="flex-start" mb="20px">
          {Category.map((list, index) => (
            <PressableContainer
              key={index}
              onPress={() => setSelected(list.name)}
            >
              <HeaderText2
                color={selected === list.name ? Colors.black : Colors.grey}
                font={Font.Medium}
                mr="50px"
                fontSize={14}
              >
                {list.name}
              </HeaderText2>
            </PressableContainer>
          ))}
        </FlexRowContainer>
        {selected === CategoryList.USERS && <UsersList />}
        {selected === CategoryList.CHATS && <ChatList />}
      </FlexColumnContainer>
    </MainContainer>
  );
};

export default DashboardScreen;

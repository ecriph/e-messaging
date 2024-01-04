import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
  PressableContainer,
} from '../../../internals/ui-kit/container';
import { HeaderText1, SmallText } from '../../../internals/ui-kit/text';
import { PrimaryInput } from '../../../internals/ui-kit/input';
import { ChatButton } from '../../../internals/ui-kit/button';
import { Font, FontSize } from '../../../internals/ui-kit/theme';
import BackArrow from '../../../internals/ui-kit/back-arrow';
import { Formik } from 'formik';
import { UserRootState } from '../../../redux/user/reducer';
import { ChatContainer } from './chat-component';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Alert } from 'react-native';
import { RootStackParamList } from '../../../navigation/route-types';
import { RouteProp } from '@react-navigation/native';
import { useMainApi } from '../../../internals/api/use-main-request';
import socket from '../../../internals/service/socket-services';
import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { ScrollView } from 'react-native-gesture-handler';
import useWebSocket from './use-socket';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';
import { sendPushNotification } from '../../../internals/service/push-notification';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

type Props = {
  route: ChatScreenRouteProp;
};
interface MessageProps {
  message: string;
}

const ChatScreen = ({ route }: Props) => {
  const initialValues: MessageProps = { message: '' };
  const { getRequest, postRequest } = useMainApi();
  const { conversationId, username } = route.params;
  const [chatMessage, setChatMessage] = useState<CreateChatMessageDTO[]>([]);
  const user = useAppSelector((state: UserRootState) => state.user);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const [typing, setTyping] = useState<string>();
  const [count, setUnreadCount] = useState<string>();

  const handleScrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleStatus = () => {
    socket.emit('typingStatus', {
      userId: user.userId,
      username: user.fullname,
      typing: true,
    });
  };
  const getMessages = useCallback(async () => {
    try {
      const messages = await getRequest(
        '/v1/message/list/message/' + conversationId
      );

      if (messages.failure) {
        Alert.alert(messages.failure);
      } else {
        setChatMessage(messages.body); // Assuming messages.body is an array
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [getRequest, conversationId]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useWebSocket(
    user.userId,
    (myMessage: CreateChatMessageDTO) => {
      setChatMessage((prevMessages) => [...prevMessages, myMessage]);

      handleScrollToEnd();
    },
    (typing: UserStatus) => {
      if (typing.status === true) {
        setTyping(`${typing.username} is typing...`);
      } else {
        setTyping('');
      }
    }
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { resetForm }) => {
        const newMessage = {
          senderId: user.userId,
          content: values.message,
          createdAt: new Date(Date.now()),
        };
        const payload = {
          content: values.message,
          conversationId: conversationId,
        };
        try {
          const messages = await postRequest(
            '/v1/message/create/message',
            payload
          );

          if (messages.failure) {
            Alert.alert(messages.failure);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }

        setChatMessage([...chatMessage, newMessage]);
        handleScrollToEnd();
        resetForm();
      }}
    >
      {({ errors, handleChange, handleSubmit, values }) => (
        <MainContainer
          BottomComponent={
            <FlexRowContainer
              padTop="20px"
              align="center"
              justifyContent="space-between"
            >
              <PrimaryInput
                style={{ width: '80%' }}
                text=""
                placeholder="Enter text here"
                value={values.message}
                onChangeText={handleChange('message')}
                fontSize={FontSize.header1}
                error={errors.message}
                onFocus={handleScrollToEnd}
                onKeyPress={handleStatus}
              />
              <ChatButton width="15%" mb="0px" onPress={handleSubmit} />
            </FlexRowContainer>
          }
        >
          <FlexColumnContainer mt="40px">
            <FlexRowContainer justifyContent="space-between" mb="20px">
              <FlexColumnContainer>
                <FlexRowContainer justifyContent="space-between" align="center">
                  <BackArrow />

                  <HeaderText1 font={Font.Bold} ml="15px">
                    {username}
                  </HeaderText1>
                  <SmallText fontSize={10}>{typing}</SmallText>
                </FlexRowContainer>
              </FlexColumnContainer>
              <FlexColumnContainer>
                {/* <Ionicons name="call-outline" size={24} color="black" /> */}
              </FlexColumnContainer>
            </FlexRowContainer>
            <PressableContainer>
              <ScrollView
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
              >
                {chatMessage.length == 0 ? (
                  <FlexColumnContainer align="center">
                    <HeaderText1 font={Font.Light} fontSize={FontSize.header2}>
                      No messages yet with user
                    </HeaderText1>
                  </FlexColumnContainer>
                ) : (
                  <ChatContainer chatMessage={chatMessage} id={user.userId} />
                )}
              </ScrollView>
            </PressableContainer>
          </FlexColumnContainer>
        </MainContainer>
      )}
    </Formik>
  );
};

export default ChatScreen;

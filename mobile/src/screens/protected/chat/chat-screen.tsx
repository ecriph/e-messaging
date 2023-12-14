import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Circle,
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
  PressableContainer,
} from '../../../internals/ui-kit/container';
import { HeaderText1 } from '../../../internals/ui-kit/text';
import { PrimaryInput } from '../../../internals/ui-kit/input';
import { ChatButton } from '../../../internals/ui-kit/button';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import BackArrow from '../../../internals/ui-kit/back-arrow';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { ChatRootState, LOAD_MESSAGES } from '../../../redux/chat/reducer';
import { UserRootState } from '../../../redux/user/reducer';
import { ChatContainer } from './use-chat-component';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Alert } from 'react-native';
import { RootStackParamList } from '../../../navigation/route-types';
import { RouteProp } from '@react-navigation/native';
import { useMainApi } from '../../../internals/api/use-main-request';
import socket from '../../../internals/service/socket-services';
import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { ScrollView } from 'react-native-gesture-handler';

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
  const { conversationId } = route.params;
  const [chatMessage, setChatMessage] = useState<CreateChatMessageDTO[]>([]);
  const user = useAppSelector((state: UserRootState) => state.user);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const handleScrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
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

  useEffect(() => {
    const handleNewMessage = (message: CreateChatMessageDTO) => {
      setChatMessage((prevMessages) => [...prevMessages, message]);
      handleScrollToEnd();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      // Cleanup the socket event listener when the component unmounts
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatMessage]);

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
          } else {
            console.log(messages.data);
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
              />
              <ChatButton width="15%" mb="0px" onPress={handleSubmit} />
            </FlexRowContainer>
          }
        >
          <FlexColumnContainer mt="70px">
            <FlexRowContainer justifyContent="space-between" mb="20px">
              <FlexColumnContainer>
                <FlexRowContainer justifyContent="space-between" align="center">
                  <BackArrow />
                  <Circle
                    ml="10px"
                    width="24px"
                    height="24px"
                    bg={Colors.offwhite}
                  >
                    <FontAwesome
                      name="user-circle-o"
                      size={24}
                      color={Colors.grey}
                    />
                  </Circle>
                  <HeaderText1 font={Font.Medium} ml="15px">
                    Username
                  </HeaderText1>
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

import React, { useEffect, useRef } from 'react';
import {
  Circle,
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
} from '../../../internals/ui-kit/container';
import { HeaderText1 } from '../../../internals/ui-kit/text';
import { PrimaryInput } from '../../../internals/ui-kit/input';
import { ChatButton } from '../../../internals/ui-kit/button';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import BackArrow from '../../../internals/ui-kit/back-arrow';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import socket from '../../../internals/service/socket-services';
import { ChatRootState, LOAD_MESSAGES } from '../../../redux/chat/reducer';
import { UserRootState } from '../../../redux/user/reducer';
import { ChatContainer } from './use-chat-component';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { ScrollView } from 'react-native';

type Props = {};
interface MessageProps {
  message: string;
}

const ChatScreen = (props: Props) => {
  const initialValues: MessageProps = { message: '' };
  const chatMessages = useAppSelector((state: ChatRootState) => state.chat);
  const user = useAppSelector((state: UserRootState) => state.user);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const handleScrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => {
        // socket.emit('chatMessage', values.message);
        // alert(`message ${values.message} sent`);
        const newMessage = {
          id: user.userId,
          message: values.message,
          name: 'Prince',
          status: 'sent',
          date: Date.now(),
        };
        dispatch(
          LOAD_MESSAGES({
            chatMessage: [...chatMessages.chatMessage, newMessage],
          })
        );
        handleScrollToEnd();
        resetForm();
      }}
    >
      {({ errors, handleChange, handleSubmit, values }) => (
        <MainContainer
          BottomComponent={
            <FlexRowContainer align="center" justifyContent="space-between">
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
                <Ionicons name="call-outline" size={24} color="black" />
              </FlexColumnContainer>
            </FlexRowContainer>
            <ScrollView ref={scrollViewRef}>
              <ChatContainer chatMessage={chatMessages} id={user.userId} />
            </ScrollView>
          </FlexColumnContainer>
        </MainContainer>
      )}
    </Formik>
  );
};

export default ChatScreen;

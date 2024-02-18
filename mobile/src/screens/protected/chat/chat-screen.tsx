import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
  PressableContainer,
} from '../../../internals/ui-kit/container';
import { HeaderText1, SmallText } from '../../../internals/ui-kit/text';
import { PrimaryInput } from '../../../internals/ui-kit/input';
import { AttachButton, ChatButton } from '../../../internals/ui-kit/button';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import BackArrow from '../../../internals/ui-kit/back-arrow';
import { Formik } from 'formik';
import { UserRootState } from '../../../redux/user/reducer';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Alert } from 'react-native';
import { RootStackParamList } from '../../../navigation/route-types';
import { RouteProp } from '@react-navigation/native';
import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { ScrollView } from 'react-native-gesture-handler';
import { UserStatus } from '@/shared/users/user-login/user-status.dto';
import { sendPushNotification } from '../../../internals/service/push-notification';
import { api } from '../../../internals/api/use-main-axios';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ChatAttachment } from './chat-component/chat-attachment';
import { ChatContainer } from './chat-component/chat-container';
import useModal from '../../../internals/utils/use-modal-sheet';
import socket from '../../../internals/service/socket/socket-services';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

type Props = {
  route: ChatScreenRouteProp;
};
interface MessageProps {
  message: string;
}

const ChatScreen = ({ route }: Props) => {
  const initialValues: MessageProps = { message: '' };
  const { conversationId, username } = route.params;
  const [chatMessage, setChatMessage] = useState<CreateChatMessageDTO[]>([]);
  const user = useAppSelector((state: UserRootState) => state.user);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const [typing, setTyping] = useState<string>();
  const [message, setMessage] = useState<string>('');
  const snapPoints = React.useMemo(() => ['30%', '40%', '75%', '95%'], []);
  const {
    handleClick,
    handleCloseModal,
    handlePresentModalOpen,
    sheetRef,
    openIndex,
    isOpen,
  } = useModal();

  const handleScrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleMessage = (value: string) => {
    setMessage(value);
  };

  // const getMessages = useCallback(async () => {

  //   await api.get(
  //       '/v1/message/list/message/' + conversationId
  //     ).then(resp => {
  //       setChatMessage(resp.data)

  //     }).catch(err => {
  //       Alert.alert(err)
  //     })

  // }, []);

  useLayoutEffect(() => {
    socket.emit('findConversation', conversationId);
    socket.on('foundConverstaion', (messages) => {
      setChatMessage(messages);
    });
  }, []);

  useEffect(() => {
    socket.on('foundConverstaion', (messages) => {
      setChatMessage(messages);
    });
  }, [socket]);

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
          senderId: user.userId,
          conversationId: conversationId,
        };

        socket.emit('newMessage', payload);

        // const messages = await api
        //   .post('/v1/message/create/message', payload)
        //   .then((resp) => {})
        //   .catch((err) => {
        //     Alert.alert(err);
        //   });

        // setChatMessage([...chatMessage, newMessage]);
        handleScrollToEnd();
        resetForm();
      }}
    >
      {({ errors, handleChange, handleSubmit, values }) => (
        <MainContainer
          bgColor={isOpen ? '#00000090' : Colors.white}
          useOverlay={isOpen ? true : false}
          BottomComponent={
            <FlexRowContainer
              padTop="20px"
              align="center"
              justifyContent="space-between"
            >
              <PrimaryInput
                style={{ width: '80%' }}
                text=""
                placeholder="Type message here"
                value={message}
                onChangeText={(value) => handleMessage(value)}
                fontSize={FontSize.header1}
                error={errors.message}
                onFocus={handleScrollToEnd}
                // onKeyPress={handleStatus}
              />
              {message !== '' ? (
                <ChatButton width="15%" mb="0px" onPress={handleSubmit} />
              ) : (
                <AttachButton
                  width="15%"
                  mb="0px"
                  onPress={() => handlePresentModalOpen(0)}
                />
              )}
              <BottomSheetModal
                ref={sheetRef}
                onChange={handleClick}
                index={openIndex}
                snapPoints={snapPoints}
              >
                <ChatAttachment
                  onClick={handleCloseModal}
                  onSaveUrl={(url) => console.log(url)}
                />
              </BottomSheetModal>
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
                  <FlexColumnContainer
                    mt="250px"
                    align="center"
                    justifyContent="center"
                  >
                    <HeaderText1 font={Font.Light} fontSize={12}>
                      Send your first message to {username}
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

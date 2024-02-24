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
import { Ionicons } from '@expo/vector-icons';

import { UserRootState } from '../../../redux/user/reducer';
import { useAppSelector } from '../../../redux/hooks';
import { ActivityIndicator, Alert } from 'react-native';
import { RootStackParamList } from '../../../navigation/route-types';
import { RouteProp } from '@react-navigation/native';
import { CreateChatMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { ScrollView } from 'react-native-gesture-handler';
import { sendPushNotification } from '../../../internals/service/push-notification';
import { api } from '../../../internals/api/use-main-axios';
import { BottomSheetModal, TouchableOpacity } from '@gorhom/bottom-sheet';
import { ChatAttachment } from './chat-component/chat-attachment';
import { ChatContainer } from './chat-component/chat-container';
import useModal from '../../../internals/utils/use-modal-sheet';
import socket from '../../../internals/service/socket/socket-services';
import * as Speech from 'expo-speech';

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
  const scrollViewRef = useRef<ScrollView>(null);
  const [typing, setTyping] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [voiceNote, setVoiceNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
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

  const handleStatus = (cid: string, name: string) => {
    const data = { conversationId: cid, username: name, userId: user.userId };
    socket.emit('onType', data);
  };

  const getMessages = useCallback(async () => {
    setMessageLoading(true);
    await api
      .get('/v1/message/list/message/' + conversationId)
      .then((resp) => {
        setChatMessage(resp.data);
        resp.data.map((data: CreateChatMessageDTO) => {
          if (data.category === 'Photo') {
            setVoiceNote((prev) => prev + 'Image attachment,');
          } else {
            setVoiceNote((prev) => prev + data.content + ',');
          }
        });
        setMessageLoading(false);
      })
      .catch((err) => {
        Alert.alert(err);
        setMessageLoading(false);
      });
  }, []);

  const getExpo = useCallback(async () => {
    await api
      .get('/v1/message/list/rtoken/' + conversationId)
      .then((resp) => {
        setToken(resp.data);
      })
      .catch((err) => {
        Alert.alert(err);
      });
  }, []);

  useLayoutEffect(() => {
    getExpo();
    getMessages();
    handleScrollToEnd();
  }, []);

  const handlePlayConversation = (value: string) => {
    if (value === 'play') {
      Speech.speak(voiceNote, {
        onDone: () => {
          setStatus('stop');
        },
      });
      setStatus('play');
    } else if (value === 'stop') {
      Speech.stop();
      setStatus('stop');
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', (messages) => {
      setChatMessage(messages);
      handleScrollToEnd();
    });

    socket.on('typingResponse', (resp) => {
      if (resp.id !== user.userId) {
        setTyping(resp.message);
      }
      setTimeout(() => {
        setTyping('');
      }, 10000);
    });
  }, [socket]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        const newMessage = {
          senderId: user.userId,
          content: message,
          createdAt: new Date(Date.now()),
          category: 'Text',
        };
        const payload = {
          content: message,
          userId: user.userId,
          conversationId: conversationId,
          category: 'Text',
        };

        socket.emit('sendMessage', payload);
        setChatMessage((data) => [...data, newMessage]);
        sendPushNotification(token, message, user.fullname);
        handleScrollToEnd();
        setMessage('');
      }}
    >
      {({ errors, handleChange, handleSubmit, values }) => (
        <MainContainer
          bgColor={isOpen ? '#00000090' : Colors.white}
          useOverlay={isOpen ? true : false}
          BottomComponent={
            <>
              {loading ? (
                <FlexRowContainer
                  justifyContent="center"
                  align="center"
                  bg="white"
                  padTop="20px"
                  pb="30px"
                >
                  <SmallText fontSize={14}>Hold on uploading media</SmallText>
                  <ActivityIndicator size="small" color={Colors.green} />
                </FlexRowContainer>
              ) : (
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
                    onKeyPress={() =>
                      handleStatus(conversationId, user.fullname)
                    }
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
                      onLoad={(status) => setLoading(status)}
                      onSaveUrl={(url) => {
                        const payload = {
                          content: url,
                          userId: user.userId,
                          conversationId: conversationId,
                          category: 'Photo',
                        };
                        const newMessage = {
                          senderId: user.userId,
                          content: url,
                          createdAt: new Date(Date.now()),
                          category: 'Photo',
                        };
                        socket.emit('sendMessage', payload);
                        setChatMessage((data) => [...data, newMessage]);
                        sendPushNotification(
                          token,
                          'An image attachment was sent',
                          user.fullname
                        );
                        handleScrollToEnd();
                        setLoading(false);
                        setMessage('');
                      }}
                    />
                  </BottomSheetModal>
                </FlexRowContainer>
              )}
            </>
          }
        >
          <FlexColumnContainer mt="20px" pt="50px" pb="50px">
            <FlexRowContainer justifyContent="space-between">
              <FlexColumnContainer>
                <FlexRowContainer justifyContent="flex-start" align="center">
                  <BackArrow />
                </FlexRowContainer>
                <FlexRowContainer justifyContent="flex-start">
                  <HeaderText1 font={Font.Bold}>{username}</HeaderText1>
                </FlexRowContainer>
                <SmallText
                  fontSize={12}
                  font={Font.SemiBold}
                  color={Colors.green}
                >
                  {typing}
                </SmallText>
              </FlexColumnContainer>
              <FlexRowContainer justifyContent="space-evenly">
                {(status === '' || status === 'stop') && (
                  <TouchableOpacity
                    onPress={() => handlePlayConversation('play')}
                  >
                    <Ionicons name="play" size={24} color={Colors.grey} />
                  </TouchableOpacity>
                )}
                {status === 'play' && (
                  <TouchableOpacity
                    onPress={() => handlePlayConversation('stop')}
                  >
                    <Ionicons name="stop" size={24} color={Colors.grey} />
                  </TouchableOpacity>
                )}
              </FlexRowContainer>
            </FlexRowContainer>
            <PressableContainer>
              <ScrollView
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
              >
                {messageLoading ? (
                  <FlexRowContainer mt="200px">
                    <ActivityIndicator size="large" color={Colors.green} />
                  </FlexRowContainer>
                ) : chatMessage.length == 0 ? (
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

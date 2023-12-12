import React, { useCallback, useEffect, useState } from 'react';
import {
  Circle,
  FlexColumnContainer,
  FlexRowContainer,
  PressableContainer,
} from '../../../internals/ui-kit/container';
import { Colors, Font, FontSize } from '../../../internals/ui-kit/theme';
import {
  HeaderText1,
  NormalText,
  SmallText,
} from '../../../internals/ui-kit/text';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../../redux/hooks';
import { Octicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useMainApi } from '../../../internals/api/use-main-request';
import { ConversationResponseListDTO } from '@/shared/messages/conversation.dto';
import { useNavigation } from '@react-navigation/native';

export const ChatList = () => {
  const { getRequest } = useMainApi();
  const [_convo, setConvo] = useState<ConversationResponseListDTO[]>();
  const navigation = useNavigation();

  const getConvo = useCallback(async () => {
    const getList = await getRequest('/v1/message/list/conversation');

    if (getList.failure) {
      Alert.alert(getList.failure);
    } else {
      setConvo(getList.body);
    }
  }, []);

  useEffect(() => {
    getConvo();
  }, []);
  return (
    <FlexColumnContainer>
      {_convo?.length === 0 ? (
        <FlexColumnContainer align="center" mt="20px">
          <Octicons name="inbox" size={34} color={Colors.green} />
          <HeaderText1 font={Font.Light}>No Chats available</HeaderText1>
          <SmallText mt="10px" fontSize={12} color={Colors.grey}>
            Click on Users to start a conversation
          </SmallText>
        </FlexColumnContainer>
      ) : (
        <FlexColumnContainer mt="20px">
          {_convo?.map((conversation, index) => (
            <PressableContainer
              key={index}
              onPress={() => {
                navigation.navigate('ChatScreen', {
                  conversationId: conversation.id,
                });
              }}
            >
              <FlexRowContainer
                justifyContent="flex-start"
                align="center"
                mb="20px"
              >
                <FlexColumnContainer mr="10px" align="flex-start">
                  <Circle width="30px" height="30px" bg={Colors.offwhite}>
                    <FontAwesome
                      name="user-circle-o"
                      size={30}
                      color={Colors.grey}
                    />
                  </Circle>
                </FlexColumnContainer>
                <FlexColumnContainer
                  mr="60px"
                  justifyContent="flex-start"
                  align="flex-start"
                >
                  <HeaderText1 lineHeight="25px">
                    {conversation.recipientId}
                  </HeaderText1>
                  <HeaderText1
                    lineHeight="25px"
                    color={Colors.grey}
                    font={Font.Light}
                  >
                    {conversation.messages.content}
                  </HeaderText1>
                </FlexColumnContainer>
                <FlexColumnContainer
                  justifyContent="space-evenly"
                  align="flex-end"
                >
                  <NormalText
                    lineHeight="25px"
                    color={Colors.grey}
                  ></NormalText>
                  {/* <Circle width="20px" height="20px">
                    <HeaderText1 lineHeight="20px" fontSize={FontSize.normal2}>
                      1
                    </HeaderText1>
                  </Circle> */}
                </FlexColumnContainer>
              </FlexRowContainer>
            </PressableContainer>
          ))}
        </FlexColumnContainer>
      )}
    </FlexColumnContainer>
  );
};

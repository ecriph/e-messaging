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
import { useMainApi } from '../../../internals/api/use-main-request';
import { Alert } from 'react-native';
import { UserDTO } from '@/shared/users/user.dto';
import { useNavigation } from '@react-navigation/native';

interface ChatProps {
  onPress: () => void;
  // userName: string;
  // timeStamp: string;
  // lastMessage: string;
  // indicator: number;
}

export const UsersList = () => {
  const { getRequest, postRequest } = useMainApi();
  const [_userList, setList] = useState<UserDTO[]>();
  const navigation = useNavigation();

  const getUserList = useCallback(async () => {
    const getList = await getRequest('/v1/message/list/users');

    if (getList.failure) {
      Alert.alert(getList.failure);
    } else {
      setList(getList.body);
    }
  }, []);

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <FlexColumnContainer mt="20px">
      {_userList?.length === 0 ? (
        <FlexColumnContainer align="center" mt="20px">
          <HeaderText1 font={Font.Light}>
            Oops!! just you, no registered user
          </HeaderText1>
        </FlexColumnContainer>
      ) : (
        _userList?.map((list, index) => (
          <PressableContainer
            key={index}
            onPress={async () => {
              const payload = { recipientId: list.id };
              const startConvo = await postRequest(
                '/v1/message/create/conversation',
                payload
              );

              if (startConvo.failure) {
                Alert.alert(startConvo.failure);
              } else {
                navigation.navigate('ChatScreen', {
                  conversationId: startConvo.data.id,
                });
              }
            }}
          >
            <FlexRowContainer
              justifyContent="space-between"
              align="center"
              mb="20px"
            >
              <FlexRowContainer>
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
                  <HeaderText1 lineHeight="25px">{list.fullname}</HeaderText1>
                </FlexColumnContainer>
              </FlexRowContainer>
              <FlexColumnContainer
                justifyContent="space-evenly"
                align="flex-end"
              >
                {/* <NormalText lineHeight="20px" color={Colors.black}>
                  12:00pm
                </NormalText>
                <NormalText lineHeight="20px" color={Colors.grey}>
                  Last seen
                </NormalText> */}
              </FlexColumnContainer>
            </FlexRowContainer>
          </PressableContainer>
        ))
      )}
    </FlexColumnContainer>
  );
};

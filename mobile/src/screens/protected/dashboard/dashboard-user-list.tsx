import React, { useCallback, useEffect, useState } from 'react';
import {
  Circle,
  FlexColumnContainer,
  FlexRowContainer,
  PressableContainer,
} from '../../../internals/ui-kit/container';
import { Colors, Font } from '../../../internals/ui-kit/theme';
import { HeaderText1 } from '../../../internals/ui-kit/text';
import { FontAwesome } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { UserDTO } from '@/shared/users/user.dto';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../../internals/api/use-main-axios';
import { useAppSelector } from '../../../redux/hooks';

interface ChatProps {
  onPress: () => void;
  // userName: string;
  // timeStamp: string;
  // lastMessage: string;
  // indicator: number;
}

export const UsersList = () => {
  const [_userList, setList] = useState<UserDTO[]>();
  const navigation = useNavigation();
  const user = useAppSelector((state) => state.user);

  const getUserList = useCallback(async () => {
    await api
      .get('/v1/message/list/users')
      .then((resp) => {
        setList(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <FlexColumnContainer mt="20px">
      <PressableContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                  const payload = {
                    recipientId: list.id,
                    userName: user.fullname,
                    recipientName: list.fullname,
                  };
                  await api
                    .post('/v1/message/create/conversation', payload)
                    .then((resp) => {
                      navigation.navigate('ChatScreen', {
                        conversationId: resp.data.id,
                        username: resp.data.userName,
                      });
                    })
                    .catch((err) => {
                      Alert.alert(err);
                    });
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
                      <HeaderText1 lineHeight="25px">
                        {list.fullname}
                      </HeaderText1>
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
        </ScrollView>
      </PressableContainer>
    </FlexColumnContainer>
  );
};

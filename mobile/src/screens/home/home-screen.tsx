import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components';
import SplashIcon from '../../../assets/icon.png';
import {
  MainContainer,
  FlexColumnContainer,
  FlexRowContainer,
} from '../../internals/ui-kit/container';
import { HeaderText4, SubHeaderText } from '../../internals/ui-kit/text';
import { PrimaryButton, SecondaryButton } from '../../internals/ui-kit/button';
import { Colors } from '../../internals/ui-kit/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageWrapper = styled(Image)`
  width: ${({ width }) => width || '170px'};
  height: ${({ height }) => height || '170px'};
`;

export default function HomeScreen() {
  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  return (
    <MainContainer
      bgColor={Colors.black}
      BottomComponent={
        <>
          <FlexColumnContainer mt="30px">
            <HeaderText4 color={Colors.white} weight="800">
              eChat
            </HeaderText4>
            <SubHeaderText mb="20px" color={Colors.offwhite}>
              Connecting you with friends and family
            </SubHeaderText>
          </FlexColumnContainer>
          <FlexColumnContainer>
            <PrimaryButton
              text="Login"
              onPress={() => {
                AsyncStorage.clear();
                navigation.navigate('LoginScreen');
              }}
            />
            <SecondaryButton
              text="Create Account"
              onPress={() => navigation.navigate('RegisterScreen')}
            />
          </FlexColumnContainer>
        </>
      }
    >
      <FlexRowContainer mt="100px">
        <ImageWrapper source={SplashIcon} />
      </FlexRowContainer>
    </MainContainer>
  );
}

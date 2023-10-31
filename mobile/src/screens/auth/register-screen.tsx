import React from 'react';
import {
  FlexColumnContainer,
  MainContainer,
} from '../../internals/ui-kit/container';
import { HeaderText1 } from '../../internals/ui-kit/text';

type Props = {};

const RegisterScreen = (props: Props) => {
  return (
    <MainContainer>
      <FlexColumnContainer>
        <HeaderText1>Register Screen</HeaderText1>
      </FlexColumnContainer>
    </MainContainer>
  );
};

export default RegisterScreen;

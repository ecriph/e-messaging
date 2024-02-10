import React from 'react';
import {
  FlexColumnContainer,
  MainContainer,
} from '../../../internals/ui-kit/container';
import { HeaderText2 } from '../../../internals/ui-kit/text';

type Props = {};

export const ForgotPassword = (props: Props) => {
  return (
    <MainContainer>
      <FlexColumnContainer>
        <HeaderText2>Reset Password</HeaderText2>
      </FlexColumnContainer>
    </MainContainer>
  );
};

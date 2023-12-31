import React from 'react';
import {
  FlexColumnContainer,
  MainContainer,
} from '../../../internals/ui-kit/container';
import { HeaderText1 } from '../../../internals/ui-kit/text';

type Props = {};

const ProfileScreen = (props: Props) => {
  return (
    <MainContainer>
      <FlexColumnContainer>
        <HeaderText1>Profile Screen</HeaderText1>
      </FlexColumnContainer>
    </MainContainer>
  );
};

export default ProfileScreen;

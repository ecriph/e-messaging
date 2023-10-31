import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

// Styled component for the loading container
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled(ActivityIndicator)`
  margin-bottom: 10px;
`;

const Loading = () => {
  return (
    <Container>
      <Spinner size="large" color="#007bff" />
    </Container>
  );
};

export default Loading;

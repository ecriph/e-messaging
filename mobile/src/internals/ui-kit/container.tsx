import { useState, useEffect } from 'react';
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import styled from 'styled-components/native';
import { Colors } from './theme';

interface ContainerProps {
  BottomComponent?: React.ReactNode;
  bgColor?: string;
  children: React.ReactNode;
  useFullScreen?: boolean;
  useOverlay?: boolean;
}
interface SafeAreaViewProps {
  background?: string;
  useOverlay?: boolean;
}
interface KeyboardAvoidingViewProps {}
interface ContainerViewProps {
  useFullScreen?: boolean;
  useOverlay?: boolean;
  fullScreenMargin?: string;
}

const SafeAreaView = styled.SafeAreaView<SafeAreaViewProps>`
  height: 100%;
  background-color: ${({ background }) => background || Colors.white};
  opacity: ${({ useOverlay }) => (useOverlay ? 0.5 : 1)};
`;

const KeyboardAvoidingView = styled.KeyboardAvoidingView<KeyboardAvoidingViewProps>`
  flex: 1;
`;

const Container = styled.View<ContainerViewProps>`
  margin: ${({ useFullScreen, fullScreenMargin }) =>
    useFullScreen ? fullScreenMargin : '0px 25px'};
  flex: 1;
  opacity: ${({ useOverlay }) => (useOverlay ? 0.6 : 0.9)};
`;

export const BottomComponentWrapper = styled.View`
  margin: 0 20px;
`;

export const MainContainer: React.FC<ContainerProps> = ({
  BottomComponent,
  bgColor,
  children,
  useFullScreen = false,
  useOverlay = false,
}) => {
  const [fullScreenMargin, setFullScreenMargin] = useState('0px');

  useEffect(() => {
    if (useFullScreen && Platform.OS === 'ios') {
      setFullScreenMargin('-12% 0 0 0');
    }
  }, [useFullScreen]);

  return (
    <SafeAreaView background={bgColor} useOverlay={useOverlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container
            useFullScreen={useFullScreen}
            fullScreenMargin={fullScreenMargin}
          >
            {children}
          </Container>
        </TouchableWithoutFeedback>
        <BottomComponentWrapper>{BottomComponent}</BottomComponentWrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/*
  Use this for pressable elements like Icons, links e.t.c
  for better experience, do not use touchOpacity for icons and links.
*/
interface PressableContainerProps {
  padding?: string;
}
interface FlexRowProps {
  justifyContent?:
    | 'left'
    | 'right'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-evenly'
    | 'space-between';
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center';
  width?: string;
  mt?: string;
  ml?: string;
  mr?: string;
  mb?: string;
  bg?: string;
  br?: string;
  height?: string;
}
export const PressableContainer = styled.Pressable<PressableContainerProps>`
  padding: ${({ padding }) => padding || '0px'};
`;

export const FlexRowContainer = styled.View<FlexRowProps>`
  display: flex;
  flex-direction: row;
  margin-bottom: ${({ mb }) => mb || '0px'};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-left: ${({ ml }) => ml || '0px'};
  margin-right: ${({ mr }) => mr || '0px'};
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: ${({ align }) => align || 'stretch'};
  width: ${({ width }) => width || 'auto'};
  background-color: ${({ bg }) => bg || ''};
`;
export const FlexRowRecieveChat = styled.View<FlexRowProps>`
  display: flex;
  flex-direction: row;
  margin-bottom: ${({ mb }) => mb || '0px'};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-left: ${({ ml }) => ml || '0px'};
  margin-right: ${({ mr }) => mr || '0px'};
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: ${({ align }) => align || 'stretch'};
  width: ${({ width }) => width || 'auto'};
  padding: 10px;
  background-color: ${({ bg }) => bg || Colors.offwhite};
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
export const FlexRowSendChat = styled.View<FlexRowProps>`
  display: flex;
  flex-direction: row;
  margin-bottom: ${({ mb }) => mb || '0px'};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-left: ${({ ml }) => ml || '0px'};
  margin-right: ${({ mr }) => mr || '0px'};
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: ${({ align }) => align || 'stretch'};
  width: ${({ width }) => width || 'auto'};
  background-color: ${({ bg }) => bg || Colors.grey};
  border-top-left-radius: 80px;
  border-bottom-left-radius: 80px;
  border-bottom-right-radius: 80px;
`;

export const FlexColumnContainer = styled.View<FlexRowProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ mb }) => mb || '0px'};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-left: ${({ ml }) => ml || '0px'};
  margin-right: ${({ mr }) => mr || '0px'};
  border-radius: ${({ br }) => br || '0px'};
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: ${({ align }) => align || 'stretch'};
  height: ${({ height }) => height || 'auto'};
  background-color: ${({ bg }) => bg || ''};
`;

export const Circle = styled.View<FlexRowProps>`
  width: ${({ width }) => width || '60px'};
  height: ${({ height }) => height || '60px'};
  margin-right: ${({ mr }) => mr || '0px'};
  border-radius: 80px;
  background-color: ${({ bg }) => bg || Colors.green};
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 10px;
`;

export const ImageWrap = styled(Image)`
  width: ${({ width }) => width || '30px'};
  height: ${({ height }) => height || '30px'};
`;

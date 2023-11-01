import styled from 'styled-components/native';
import { Colors } from './theme';
import { HeaderText2, NormalText } from './text';
import { FontAwesome } from '@expo/vector-icons';

interface TouchableProps {
  height?: string;
  borderRadius?: string;
  width?: string;
  mb?: string;
}

interface ButtonProps {
  enabled?: boolean;
}

const Button = styled.TouchableOpacity<TouchableProps>`
  height: ${({ height }) => height || '50px'};
  border-radius: ${({ borderRadius }) => borderRadius || '15px'};
  width: ${({ width }) => width || '100%'};
  color: white;
  align-items: center;
  justify-content: center;
`;
const Primary = styled(Button)<ButtonProps>`
  background-color: ${({ enabled }) =>
    enabled
      ? `${Colors.buttons.primary.background}`
      : `${Colors.buttons.primary.disabled}`};
  width: ${({ width }) => width || 'auto'};
  margin-bottom: ${({ mb }) => mb || '20px'};
`;
const Transparent = styled(Button)<ButtonProps>`
  background-color: ${({ enabled }) =>
    enabled
      ? `${Colors.buttons.primary.background}`
      : `${Colors.buttons.primary.disabled}`};
  margin-bottom: ${({ mb }) => mb || '20px'};
`;
const Gradient = styled(Button)<ButtonProps>`
  background-color: ${({ enabled }) =>
    enabled
      ? `${Colors.buttons.gradient.background}`
      : `${Colors.buttons.gradient.disabled}`};
  margin-bottom: ${({ mb }) => mb || '20px'};
`;
const Secondary = styled(Button)<ButtonProps>`
  background-color: ${({ enabled }) =>
    enabled
      ? `${Colors.buttons.secondary.background}`
      : `${Colors.buttons.gradient.background}`};
  margin-bottom: ${({ mb }) => mb || '20px'};
`;
const Outline = styled(Button)<ButtonProps>`
  background-color: ${({ enabled }) =>
    enabled ? `${Colors.black}` : `${Colors.buttons.outlined.disabled}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
  margin-bottom: ${({ mb }) => mb || '20px'};
`;

interface OnPressButtonProps {
  width?: string;
  text?: string;
  onPress: () => void;
  enabled?: boolean;
  mb?: string;
}

export const PrimaryButton: React.FC<OnPressButtonProps> = ({
  text,
  onPress,
  enabled = true,
}) => {
  const onBtnPress = () => {
    onPress();
  };
  return (
    <Primary onPress={onBtnPress} disabled={!enabled} enabled={enabled}>
      <HeaderText2 weight="600" color={Colors.buttons.primary.color}>
        {text}
      </HeaderText2>
    </Primary>
  );
};
export const ChatButton: React.FC<OnPressButtonProps> = ({
  width,
  onPress,
  enabled = true,
  mb,
}) => {
  const onBtnPress = () => {
    onPress();
  };
  return (
    <Primary
      onPress={onBtnPress}
      disabled={!enabled}
      enabled={enabled}
      width={width}
      mb={mb}
    >
      <FontAwesome name="send" size={25} color={Colors.white} />
    </Primary>
  );
};

export const TransparentButton: React.FC<OnPressButtonProps> = ({
  text,
  onPress,
  enabled = true,
}) => {
  const onBtnPress = () => {
    onPress();
  };
  return (
    <Transparent
      onPress={onBtnPress}
      disabled={!enabled}
      enabled={enabled}
      width="55%"
      borderRadius="15px"
      height="55px"
    >
      <HeaderText2 weight="600" color={Colors.buttons.primary.color}>
        {text}
      </HeaderText2>
    </Transparent>
  );
};

export const GradientButton: React.FC<OnPressButtonProps> = ({
  text,
  onPress,
  enabled = true,
}) => {
  const onBtnPress = () => {
    onPress();
  };
  return (
    <Gradient onPress={onBtnPress} disabled={!enabled} enabled={enabled}>
      <NormalText weight="600" color={Colors.buttons.gradient.color}>
        {text}
      </NormalText>
    </Gradient>
  );
};

export const SecondaryButton: React.FC<OnPressButtonProps> = ({
  text,
  onPress,
  enabled = true,
}) => {
  const onBtnPress = () => {
    onPress();
  };
  return (
    <Secondary onPress={onBtnPress} disabled={!enabled} enabled={enabled}>
      <HeaderText2 weight="600" color={Colors.buttons.secondary.color}>
        {text}
      </HeaderText2>
    </Secondary>
  );
};

export const OutlineButton: React.FC<OnPressButtonProps> = ({
  text,
  onPress,
  enabled = true,
}) => {
  const onBtnPress = () => {
    onPress();
  };
  return (
    <Outline
      height="25px"
      width="75px"
      onPress={onBtnPress}
      disabled={!enabled}
      enabled={enabled}
    >
      <NormalText weight="400" color={Colors.white}>
        {text}
      </NormalText>
    </Outline>
  );
};

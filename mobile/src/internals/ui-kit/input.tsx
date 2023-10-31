import styled from 'styled-components/native';
import { FlexRowContainer, PressableContainer } from './container';
import { Colors, Font, FontSize } from './theme';
import {
  HeaderText4,
  NormalText,
  SmallText,
  HeaderText1,
  HeaderText3,
} from './text';
import { useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';

interface InputWrapProps {
  height?: string;
  borderRadius?: string;
  width?: string;
  bgColor?: string;
  justify?: 'space-between' | 'space-evenly' | 'flex-start' | 'flex-end';
  mb?: string;
}
const Input = styled.TextInput<InputWrapProps>`
  height: ${({ height }) => height || '45px'};
  border-radius: ${({ borderRadius }) => borderRadius || '15px'};
  width: ${({ width }) => width || '100%'};
  padding: 0px 10px;
  font-size: ${FontSize.header3};
  font-weight: 600;
`;

const TextInputWrapper = styled.View<InputWrapProps>`
  background-color: ${({ bgColor }) =>
    bgColor || Colors.inputs.textInput.background};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justify }) => justify || 'space-between'};
  padding: 0 16px;
  border-radius: 15px;
  border-color: ${Colors.inputs.textInput.border};
  border-style: solid;
  border-width: 1px;
`;

const Outline = styled(Input)`
  background-color: ${Colors.inputs.outline};
`;
const Primary = styled(Input)`
  background-color: ${({ bgColor }) => bgColor || Colors.inputs.textInput};
`;

const Container = styled.View<InputWrapProps>`
  margin-bottom: ${({ mb }) => mb || '5px'};
`;
const EntypoIcon = styled(Entypo)`
  margin-left: -35px;
`;

interface InputFieldProps {
  placeholder?: string;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'number-pad'
    | 'url'
    | 'phone-pad'
    | 'numeric';
  value: any;
  onChangeText: () => void;
  error?: string;
  text: string;
  autoFocus?: boolean;
  edit?: boolean;
  style?: any;
  onValueChange?: () => void;
  showFlag?: boolean;
  editable?: boolean;
  label?: string;
  checked?: boolean;
  create?: () => void;
}

export const PrimaryInput: React.FC<InputFieldProps> = ({
  placeholder,
  keyboardType,
  value,
  onChangeText,
  error,
  style,
  text,
  autoFocus,
  edit,
}) => {
  const [focus, setFocus] = useState(Colors.inputs.textInput);
  const [blur, setBlur] = useState(Colors.inputs.textInput);

  const onFocus = () => {
    setFocus(Colors.inputs.outline);
    setBlur(Colors.inputs.outline);
  };
  const onBlur = () => {
    setFocus(Colors.inputs.textInput);
    setBlur(Colors.inputs.textInput);
  };

  return (
    <Container style={style}>
      <HeaderText1 color={Colors.black} font={Font.Bold}>
        {text}
      </HeaderText1>
      <TextInputWrapper>
        <Primary
          placeholderTextColor={`${Colors.inputs.placeholder}`}
          placeholder={placeholder}
          keyboardType={keyboardType || 'default'}
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          bgColor={focus.background}
          editable={edit}
        />
      </TextInputWrapper>
      <NormalText color={Colors.error}>{error}</NormalText>
    </Container>
  );
};

export const PasswordInput: React.FC<InputFieldProps> = ({
  placeholder,
  label,
  value,
  onChangeText,
  error,
  text,
  autoFocus,
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [focus, setFocus] = useState(Colors.inputs.textInput);
  const [blur, setBlur] = useState(Colors.inputs.textInput);

  const onFocus = () => {
    setFocus(Colors.inputs.outline);
    setBlur(Colors.inputs.outline);
  };
  const onBlur = () => {
    setFocus(Colors.inputs.textInput);
    setBlur(Colors.inputs.textInput);
  };
  return (
    <Container>
      <SmallText>{label}</SmallText>
      <HeaderText1 color={Colors.black}>{text}</HeaderText1>
      <TextInputWrapper bgColor={focus.background}>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={`${Colors.inputs.placeholder}`}
          secureTextEntry={hidePassword}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <PressableContainer onPress={() => setHidePassword(!hidePassword)}>
          <EntypoIcon name="eye" size={24} color="black" />
        </PressableContainer>
      </TextInputWrapper>
      <NormalText color={Colors.error}>{error}</NormalText>
    </Container>
  );
};

export const OutlineInput: React.FC<InputFieldProps> = ({
  placeholder,
  keyboardType,
  value,
  onChangeText,
  error,
  style,
  text,
}) => {
  return (
    <Container style={style}>
      <HeaderText4 color={Colors.black}>{text}</HeaderText4>
      <Outline
        placeholderTextColor={`${Colors.inputs.placeholder}`}
        placeholder={placeholder}
        keyboardType={keyboardType || 'default'}
        value={value}
        onChangeText={onChangeText}
      />
      <SmallText color={Colors.error}>{error}</SmallText>
    </Container>
  );
};

export const PhoneNumberInput: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  showFlag = false,
  editable = true,
  text,
  create,
}) => {
  const [focus, setFocus] = useState(Colors.inputs.textInput);
  const [blur, setBlur] = useState(Colors.inputs.textInput);

  const onFocus = () => {
    setFocus(Colors.inputs.outline);
    setBlur(Colors.inputs.outline);
  };
  const onBlur = () => {
    setFocus(Colors.inputs.textInput);
    setBlur(Colors.inputs.textInput);
  };
  /*
    The country retrival logic will change when there is a plan to expand to other country.
    We can then get the user's location to determine the country rather than hardcoding it like we currently do
  */

  return (
    <Container>
      <HeaderText1 color={Colors.black} font={Font.Bold}>
        {text}
      </HeaderText1>
      <TextInputWrapper bgColor={focus.background}>
        <HeaderText3>+234</HeaderText3>
        <Input
          value={value}
          keyboardType={'phone-pad'}
          editable={editable}
          onChangeText={onChangeText}
          placeholderTextColor={`${Colors.inputs.placeholder}`}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </TextInputWrapper>
      <FlexRowContainer justifyContent="space-between">
        <NormalText color={Colors.error}>{error}</NormalText>
        {error === 'Phone number does not exist' ? (
          <PressableContainer onPress={create}>
            <NormalText color={Colors.blue}>Create Account</NormalText>
          </PressableContainer>
        ) : (
          ''
        )}
      </FlexRowContainer>
    </Container>
  );
};

export const PrimaryCheckbox: React.FC<InputFieldProps> = ({
  text,
  checked,
  onValueChange,
}) => {
  return (
    <Container>
      <CheckBox value={checked} onValueChange={onValueChange} />
      <HeaderText1>{text}</HeaderText1>
    </Container>
  );
};

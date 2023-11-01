import React from 'react';
import {
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
} from '../../internals/ui-kit/container';
import { HeaderText1, HeaderText2 } from '../../internals/ui-kit/text';
import { PrimaryButton } from '../../internals/ui-kit/button';
import BackArrow from '../../internals/ui-kit/back-arrow';
import { Colors, Font } from '../../internals/ui-kit/theme';
import { PasswordInput, PrimaryInput } from '../../internals/ui-kit/input';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { LOGIN_USER } from '../../redux/user/reducer';

type Props = {};
interface LoginProps {
  email: string;
  password: string;
}

const LoginScreen = (props: Props) => {
  const [isLoading, setLoading] = React.useState();
  const initialValues: LoginProps = { email: '', password: '' };
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, action) => {
        dispatch(LOGIN_USER());
      }}
    >
      {({
        errors,
        handleChange,
        handleSubmit,
        isValid,
        isSubmitting,
        values,
      }) => (
        <MainContainer
          BottomComponent={
            <FlexColumnContainer mt="20px">
              {isLoading ? (
                <PrimaryButton
                  onPress={() => {}}
                  text="Loading"
                  enabled={false}
                />
              ) : (
                <PrimaryButton
                  text="Get in"
                  onPress={handleSubmit}
                  enabled={isValid}
                />
              )}
            </FlexColumnContainer>
          }
        >
          <FlexColumnContainer justifyContent="flex-start">
            <FlexRowContainer justifyContent="flex-start">
              <BackArrow />
            </FlexRowContainer>
            <FlexColumnContainer>
              <HeaderText2>Welcome to eChat app</HeaderText2>
              <HeaderText1 color={Colors.grey} font={Font.Light}>
                Sign in with your credentials to start chatting
              </HeaderText1>
              <PrimaryInput
                text="Email"
                onChangeText={() => handleChange('email')}
                value={values.email}
                error={errors.email}
              />
              <PasswordInput
                text="Password"
                onChangeText={() => handleChange('password')}
                value={values.password}
                error={errors.password}
              />
            </FlexColumnContainer>
          </FlexColumnContainer>
        </MainContainer>
      )}
    </Formik>
  );
};

export default LoginScreen;

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
import { LOGIN_USER } from '../../redux/user/reducer';
import { loadMessage } from '../../redux/chat/action';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useMainApi } from '../../internals/api/use-main-request';
import ErrorOverlayModal from '../../internals/ui-kit/error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLoginSchema } from '@/shared/users/user-login/user-login.schemas';
import { TransportFailure } from '../../internals/transport/transport-failure';
import { Alert } from 'react-native';
import { LOAD_CONVERSATIONS } from '../../redux/chat/reducer';

type Props = {};
interface LoginProps {
  email: string;
  password: string;
}

const LoginScreen = (props: Props) => {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const initialValues: LoginProps = { email: '', password: '' };
  const dispatch = useAppDispatch();
  const chat = useAppSelector((state) => state.chat);
  const { postRequest } = useMainApi();

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={UserLoginSchema}
      onSubmit={async (values, { setErrors }) => {
        setLoading(true);
        const payload = { email: values.email, password: values.password };
        const response = await postRequest('auth/login', payload);
        console.log(response);
        if (response.failure) {
          response.failure === TransportFailure.AbortedAndDealtWith &&
            setErrors({ password: 'Invalid Password' });

          response.failure === TransportFailure.NotFound &&
            setErrors({ email: 'Invalid Email' });
          setLoading(false);
        } else {
          const { token, refresh_token, fullname, userId } = response.data;
          AsyncStorage.setItem('token', token);
          AsyncStorage.setItem('refresh_token', refresh_token);
          setLoading(false);
          dispatch(LOGIN_USER({ fullname: fullname, userId: userId }));
        }
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
                  text="Login into account"
                  onPress={handleSubmit}
                  enabled={isValid}
                />
              )}
            </FlexColumnContainer>
          }
        >
          <FlexColumnContainer justifyContent="flex-start" mt="40px">
            <FlexRowContainer justifyContent="flex-start" mb="15px">
              <BackArrow />
            </FlexRowContainer>
            <FlexColumnContainer>
              <HeaderText2 font={Font.SemiBold}>
                Welcome to eChat app
              </HeaderText2>
              <HeaderText1 color={Colors.grey} font={Font.Light} mb="20px">
                Sign in with your credentials to start chatting
              </HeaderText1>
              <PrimaryInput
                text="Email"
                onChangeText={handleChange('email')}
                value={values.email}
                error={errors.email}
              />
              <PasswordInput
                text="Password"
                onChangeText={handleChange('password')}
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

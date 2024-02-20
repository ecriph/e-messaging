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
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransportFailure } from '../../internals/transport/transport-failure';
import * as Yup from 'yup';
import { api } from '../../internals/api/use-main-axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../internals/data/const';

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
  const navigation = useNavigation();

  const LoginValidation = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('*required'),
    password: Yup.string().min(6).required('*required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginValidation}
      onSubmit={async (values, { setErrors }) => {
        setLoading(true);
        const payload = { email: values.email, password: values.password };
        await api
          .post('auth/login', payload)
          .then(async (resp) => {
            const { access_token, refresh_token, fullname, userId } = resp.data;
            await AsyncStorage.setItem(ACCESS_TOKEN, access_token);
            await AsyncStorage.setItem(REFRESH_TOKEN, refresh_token);
            await AsyncStorage.getItem(REFRESH_TOKEN);
            console.log('reftoken' + refresh_token);
            setLoading(false);
            dispatch(LOGIN_USER({ fullname: fullname, userId: userId }));
          })
          .catch((err) => {
            if (err === TransportFailure.AbortedAndDealtWith) {
              setErrors({ password: 'Invalid Password' });
            }
            if (err === TransportFailure.NotFound) {
              setErrors({ email: 'Invalid Email' });
            }
          });
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
            <FlexColumnContainer mt="40px">
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
          <FlexColumnContainer justifyContent="flex-start" mt="50px">
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

            <FlexRowContainer justifyContent="space-between" mt="20px">
              <TouchableOpacity
                onPress={() => navigation.navigate('RegisterScreen')}
              >
                <HeaderText2
                  color={Colors.green}
                  font={Font.SemiBold}
                  fontSize={14}
                >
                  Create Account
                </HeaderText2>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotScreen')}
              >
                <HeaderText2
                  color={Colors.grey}
                  font={Font.Medium}
                  fontSize={14}
                >
                  Forgot Password
                </HeaderText2>
              </TouchableOpacity>
            </FlexRowContainer>
          </FlexColumnContainer>
        </MainContainer>
      )}
    </Formik>
  );
};

export default LoginScreen;

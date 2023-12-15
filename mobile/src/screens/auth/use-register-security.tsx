import React, { useState } from 'react';
import {
  FlexColumnContainer,
  MainContainer,
} from '../../internals/ui-kit/container';
import { PasswordInput, PhoneNumberInput } from '../../internals/ui-kit/input';
import { PrimaryButton } from '../../internals/ui-kit/button';
import { Formik } from 'formik';
import { useMainApi } from '../../internals/api/use-main-request';
import { TransportFailure } from '../../internals/transport/transport-failure';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { LOGIN_USER } from '../../redux/user/reducer';
import * as Yup from 'yup';

interface RegisterProps {
  phone: string;
  password: string;
}
export const RegisterSecurity = () => {
  const initialValues: RegisterProps = { phone: '', password: '' };

  const { postRequest } = useMainApi();
  const user = useAppSelector((state) => state.user);
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const SecureValidation = Yup.object().shape({
    phone: Yup.string().min(11).required('*required'),
    password: Yup.string().min(6).required('*required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SecureValidation}
      onSubmit={async (values, { setErrors }) => {
        setLoading(true);
        const payload = {
          fullname: user.fullname,
          password: values.password,
          phone: values.phone,
          email: user.email,
        };
        try {
          const response = await postRequest('/auth/register', payload);

          if (response.failure) {
            response.failure === TransportFailure.AbortedAndDealtWith &&
              setErrors({ phone: 'Invalid Password' });

            response.failure === TransportFailure.NotFound &&
              setErrors({ password: 'Invalid Email' });
            setLoading(false);
          } else {
            const { token, refresh_token, userId } = response.data;
            AsyncStorage.setItem('token', token);
            AsyncStorage.setItem('refresh_token', refresh_token);
            setLoading(false);
            dispatch(LOGIN_USER({ fullname: user.fullname, userId: userId }));
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
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
                  text="Get in"
                  onPress={handleSubmit}
                  enabled={isValid}
                />
              )}
            </FlexColumnContainer>
          }
        >
          <FlexColumnContainer mt="45px">
            <PhoneNumberInput
              value={values.phone}
              onChangeText={handleChange('phone')}
              text="Phone number"
              error={errors.phone}
            />
            <PasswordInput
              value={values.password}
              onChangeText={handleChange('password')}
              text="Password"
              error={errors.password}
            />
          </FlexColumnContainer>
        </MainContainer>
      )}
    </Formik>
  );
};

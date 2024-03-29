import React, { useState } from 'react';
import {
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
} from '../../internals/ui-kit/container';
import { PasswordInput, PrimaryInput } from '../../internals/ui-kit/input';
import { PrimaryButton } from '../../internals/ui-kit/button';
import { Formik } from 'formik';
import { TransportFailure } from '../../internals/transport/transport-failure';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { LOGIN_USER } from '../../redux/user/reducer';
import * as Yup from 'yup';
import { api } from '../../internals/api/use-main-axios';
import BackArrow from '../../internals/ui-kit/back-arrow';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../internals/data/const';

interface RegisterProps {
  phone: string;
  password: string;
}
export const RegisterSecurity = () => {
  const initialValues: RegisterProps = { phone: '', password: '' };

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
        await api
          .post('/auth/register', payload)
          .then(async (resp) => {
            const { token, refresh_token, userId } = resp.data;
            await AsyncStorage.setItem(ACCESS_TOKEN, token);
            await AsyncStorage.setItem(REFRESH_TOKEN, refresh_token);
            setLoading(false);
            dispatch(LOGIN_USER({ fullname: user.fullname, userId: userId }));
          })
          .catch((err) => {
            if (err === TransportFailure.AbortedAndDealtWith) {
              setErrors({ phone: 'Invalid Password' });
            }
            if (err === TransportFailure.NotFound) {
              setErrors({ password: 'Invalid Email' });
              setLoading(false);
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
            <FlexRowContainer justifyContent="flex-start" mb="20px">
              <BackArrow />
            </FlexRowContainer>
            <PrimaryInput
              value={values.phone}
              onChangeText={handleChange('phone')}
              text="Phone number"
              error={errors.phone}
              keyboardType="numeric"
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

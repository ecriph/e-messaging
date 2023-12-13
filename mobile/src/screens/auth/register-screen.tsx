import React, { useState } from 'react';
import {
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
} from '../../internals/ui-kit/container';
import { HeaderText1, HeaderText2 } from '../../internals/ui-kit/text';
import { PrimaryButton } from '../../internals/ui-kit/button';
import BackArrow from '../../internals/ui-kit/back-arrow';
import { Colors, Font } from '../../internals/ui-kit/theme';
import { PrimaryInput } from '../../internals/ui-kit/input';
import { Formik } from 'formik';
import { SAVE_PERSONAL } from '../../redux/user/reducer';
import { RegisterSecurity } from './use-register-security';
import { useAppDispatch } from '../../redux/hooks';

type Props = {};
interface RegisterProps {
  name: string;
  email: string;
}

const RegisterScreen = (props: Props) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [security, setSecurity] = useState<boolean>(false);
  const initialValues: RegisterProps = { name: '', email: '' };
  const dispatch = useAppDispatch();

  return !security ? (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        setLoading(true);
        dispatch(SAVE_PERSONAL({ fullname: values.name, email: values.email }));
        setSecurity(true);
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
          <FlexColumnContainer justifyContent="flex-start" mt="40px">
            <FlexRowContainer justifyContent="flex-start">
              <BackArrow />
            </FlexRowContainer>
            <FlexColumnContainer>
              <HeaderText2>Welcome to eChat app</HeaderText2>
              <HeaderText1 mb="20px" color={Colors.grey} font={Font.Light}>
                Register your credentials to start chatting
              </HeaderText1>
              <PrimaryInput
                text="Name"
                onChangeText={handleChange('name')}
                value={values.name}
                error={errors.name}
              />
              <PrimaryInput
                text="Email"
                onChangeText={handleChange('email')}
                value={values.email}
                error={errors.email}
              />
            </FlexColumnContainer>
          </FlexColumnContainer>
        </MainContainer>
      )}
    </Formik>
  ) : (
    <RegisterSecurity />
  );
};

export default RegisterScreen;

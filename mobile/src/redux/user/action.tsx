import asyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_SUCCESS, LOGOUT_USER, LOGIN_USER } from './reducer';

export const logout =
  () =>
  async (
    dispatch: (arg0: { payload: undefined; type: 'user/LOGOUT_USER' }) => void
  ) => {
    dispatch(LOGOUT_USER());
    asyncStorage.clear();
  };

export const confirmToken = (token: string) => () => {};

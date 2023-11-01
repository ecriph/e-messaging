import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  isLoading: boolean;
  phone: number | null;
  email: string;
  fullname: string;
  isLoggedIn: boolean;
  isUser: boolean;
};

export type UserRootState = {
  user: UserState;
};

const initialState: UserState = {
  isLoading: false,
  phone: null,
  email: '',
  fullname: '',
  isLoggedIn: false,
  isUser: false,
};

const auth = createSlice({
  name: 'user',
  initialState,

  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    LOGIN_SUCCESS: (state, action: PayloadAction<UserState>) => {
      (state.email = action.payload.email),
        (state.fullname = action.payload.fullname),
        (state.phone = action.payload.phone),
        (state.isLoggedIn = action.payload.isLoggedIn);
      state.isUser = action.payload.isUser;
    },
    LOGOUT_USER: (state) => {
      state.isLoggedIn = false;
    },

    LOGIN_USER: (state) => {
      state.isLoggedIn = true;
    },
  },
});

export const { LOGIN_SUCCESS, LOGOUT_USER, LOGIN_USER } = auth.actions;

export default auth.reducer;

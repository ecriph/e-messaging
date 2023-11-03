import { combineReducers } from '@reduxjs/toolkit';
import user from './user/reducer';
import chat from './chat/reducer';

export const rootReducer = combineReducers({
  user,
  chat,
});

export type RootState = ReturnType<typeof rootReducer>;

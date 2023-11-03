import asyncStorage from '@react-native-async-storage/async-storage';
import { ChatState, LOAD_MESSAGES } from './reducer';
import { AppDispatch } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from '@reduxjs/toolkit';

export const confirmToken = (token: string) => () => {};
export const loadMessage =
  () => async (dispatch: ThunkDispatch<RootState, undefined, AnyAction>) => {
    const message = [
      {
        id: '123456',
        name: 'User 1',
        message: 'Hello!',
        status: 'sent',
        date: Date.now(),
      },
      {
        id: 'sampleId2',
        name: 'User 2',
        message: 'Hi there!',
        status: 'sent',
        date: Date.now(),
      },
      // Add more chat messages as needed
    ];

    dispatch(LOAD_MESSAGES({ chatMessage: message }));
  };

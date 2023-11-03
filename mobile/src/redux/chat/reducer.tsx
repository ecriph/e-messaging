import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
  status: string;
  date: number;
}

export interface ChatState {
  chatMessage: ChatMessage[];
}

export interface ChatRootState {
  chat: ChatState;
}

const initialState: ChatState = {
  chatMessage: [
    {
      id: '',
      name: '',
      message: '',
      status: 'sent',
      date: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,

  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    LOAD_MESSAGES: (state, action: PayloadAction<ChatState>) => {
      state.chatMessage = action.payload.chatMessage;
    },
  },
});

export const { LOAD_MESSAGES } = chatSlice.actions;

export default chatSlice.reducer;

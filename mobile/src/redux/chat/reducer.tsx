import { createSlice } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  userId: string;
  recipientId: String;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface ChatState {
  chatMessage: ChatMessage[];
  conversation: Conversation[];
}

export interface ChatRootState {
  chat: ChatState;
}

const initialState: ChatState = {
  chatMessage: [],
  conversation: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,

  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    LOAD_MESSAGES: (state, action) => {
      state.chatMessage = action.payload.chatMessage;
    },

    LOAD_CONVERSATIONS: (state, action) => {
      state.conversation = action.payload.conversation;
    },
  },
});

export const { LOAD_MESSAGES, LOAD_CONVERSATIONS } = chatSlice.actions;

export default chatSlice.reducer;

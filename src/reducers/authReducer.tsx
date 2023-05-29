// reducers/authReducer.ts

import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  user?: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string;
  };
}

const initialState: AuthState = {
  user: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

// reducers/index.tsx

import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import authReducer from './authReducer';
// import todosReducer from './todosReducer';

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
  });

  return store;
};

const wrapper = createWrapper(makeStore);

export default wrapper;

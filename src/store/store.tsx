// store.ts

import { AnyAction, Store } from 'redux';
import { createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';

export interface State {
  isLogin: boolean;
}

// create your reducer
const reducer = (state: State = { isLogin: false }, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      const nextState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      };
      if (state.isLogin) nextState.count = state.isLogin; // preserve count value on client side navigation
      return nextState;
    case 'SETLOGIN':
      return { ...state, isLogin: action.payload };
    default:
      return state;
  }
};

// create a makeStore function
const makeStore = (context: Context) => configureStore({ reducer: reducer });

// export an assembled wrapper
export const wrapper = createWrapper<Store<State>>(makeStore, { debug: true });

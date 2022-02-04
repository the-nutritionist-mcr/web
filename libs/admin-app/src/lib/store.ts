import { configureStore } from '@reduxjs/toolkit';
import persistState from 'redux-localstorage';
import rootReducer from './rootReducer';
import { useDispatch } from 'react-redux';

export const buildStore = () =>
  configureStore({
    reducer: rootReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enhancers: [persistState('planner' as any) as any],
  });

export type AppDispatch = ReturnType<typeof buildStore>['dispatch'];

export const useAppDispatch = (): ReturnType<typeof buildStore>['dispatch'] =>
  useDispatch<AppDispatch>();

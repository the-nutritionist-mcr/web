import { configureStore } from "@reduxjs/toolkit";
import persistState from "redux-localstorage";
import rootReducer from "./rootReducer";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: rootReducer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enhancers: [persistState("planner" as any) as any],
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): typeof store.dispatch =>
  useDispatch<AppDispatch>();

export default store;

import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";

import AppState from "../types/AppState";
import { createAction } from "@reduxjs/toolkit";
import log from "loglevel";

type ThunkResult<R, A> = ThunkAction<Promise<R>, AppState, A, AnyAction>;

export const loadingStart = createAction("loadingStart");
export const loadingFailed = createAction<string>("loadingFailed");
export const loadingSucceeded = createAction("loadingSucceeded");
export const clearError = createAction("clearError");

export type ApiRequestFunction<A> = ((arg: A) => ThunkResult<void, A>) & {
  fulfilled: ReturnType<typeof createAction>;
};

export const apiRequestCreator = <R, A = void>(
  name: string,
  callback: (arg: A) => Promise<R>
): ApiRequestFunction<A> => {
  const finishAction = createAction<R>(`${name}/loading/complete`);

  return Object.assign(
    (arg: A): ThunkResult<void, A> => {
      return async (dispatch) => {
        dispatch(loadingStart());
        try {
          const apiReturnVal = await callback(arg);
          dispatch(loadingSucceeded());
          dispatch(finishAction(apiReturnVal));
        } catch (error) {
          const dispatchError = error.errors ? error.errors[0] : error;
          log.error(dispatchError);
          dispatch(loadingFailed(dispatchError.message));
        }
      };
    },
    { fulfilled: finishAction }
  );
};

export default apiRequestCreator;

import {
  clearError,
  loadingFailed,
  loadingStart,
  loadingSucceeded,
} from "./apiRequestCreator";

import AppState from "../types/AppState";
import LoadingState from "../types/LoadingState";
import { Reducer } from "@reduxjs/toolkit";

import customersSlice from "../features/customers/customersSlice";
import exclusionsSlice from "../features/exclusions/exclusionsSlice";
import plannerReducer from "../features/planner/planner-reducer";
import recipesSlice from "../features/recipes/recipesSlice";

const rootReducer: Reducer<AppState> = (state, action): AppState => {
  const customers = customersSlice.reducer(state?.customers, action);
  const exclusions = exclusionsSlice.reducer(state?.exclusions, action);
  const recipes = recipesSlice.reducer(state?.recipes, action);

  const newState: Omit<AppState, "planner"> = {
    ...state,
    customers,
    exclusions,
    recipes,
    loadingState: LoadingState.Idle,
  };
  const finalState = plannerReducer(newState as AppState, action);

  switch (action.type) {
    case loadingStart.type:
      finalState.loadingState = LoadingState.Loading;
      break;

    case loadingSucceeded.type:
      finalState.loadingState = LoadingState.Succeeeded;
      break;

    case loadingFailed.type:
      finalState.loadingState = LoadingState.Failed;
      finalState.error = action.payload;
      break;

    case clearError.type:
      finalState.loadingState = LoadingState.Idle;
      finalState.error = undefined;
  }

  return finalState;
};

export const loadingSelector = (state: AppState): LoadingState =>
  state.loadingState;

export const errorSelector = (state: AppState): string | undefined =>
  state.error;

export default rootReducer;

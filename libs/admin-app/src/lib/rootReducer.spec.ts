import {
  clearError,
  loadingFailed,
  loadingStart,
  loadingSucceeded,
} from './apiRequestCreator';
import AppState from '../types/AppState';
import LoadingState from '../types/LoadingState';
import { mock } from 'jest-mock-extended';
import rootReducer from './rootReducer';

describe('The root reducer', () => {
  it('Sets the loadingState to loading when given the loadingStart action', () => {
    const state = mock<AppState>();

    const actual = rootReducer(state, loadingStart());

    expect(actual.loadingState).toEqual(LoadingState.Loading);
  });

  it('Sets the loadingState to succeeed when given the loadingSuceeded action', () => {
    const state = mock<AppState>();

    const actual = rootReducer(state, loadingSucceeded());

    expect(actual.loadingState).toEqual(LoadingState.Succeeeded);
  });

  it('Sets the loadingState to failed and sets the error message if given a loading error', () => {
    const state = mock<AppState>();

    const actual = rootReducer(state, loadingFailed('Something went wrong'));

    expect(actual.loadingState).toEqual(LoadingState.Failed);
    expect(actual.error).toEqual('Something went wrong');
  });

  it('Clears the loadingstate and resets error message if given a clearMessage action', () => {
    const state = mock<AppState>();

    const actual = rootReducer(state, clearError());

    expect(actual.loadingState).toEqual(LoadingState.Idle);
    expect(actual.error).toBeUndefined();
  });
});

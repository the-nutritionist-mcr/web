import API, { graphqlOperation } from '@aws-amplify/api';

import {
  CreateExclusionMutationVariables,
  DeleteExclusionMutationVariables,
  UpdateExclusionMutationVariables,
} from '../../backend/query-variables-types';

import {
  createExclusionMutation,
  deleteExclusionMutation,
  listExclusionsQuery,
  updateExclusionMutation,
} from './graphql';

import type AppState from '../../types/AppState';

import Exclusion from '../../domain/Exclusion';
import LoadingState from '../../types/LoadingState';

import apiRequestCreator from '../../lib/apiRequestCreator';
import { createSlice } from '@reduxjs/toolkit';

interface ExclusionsState {
  items: Exclusion[];
  page: number;
  loadingState: LoadingState;
  error?: string;
}

const initialState: ExclusionsState = {
  items: [],
  page: 0,
  loadingState: LoadingState.Idle,
};

const MALFORMED_RESPONSE = 'Response from the server was malformed';

export const updateExclusion = apiRequestCreator(
  'exclusions/update',
  async (exclusion: Exclusion): Promise<Exclusion> => {
    const updateExclusionVariables: UpdateExclusionMutationVariables = {
      input: exclusion,
    };

    await API.graphql(
      graphqlOperation(updateExclusionMutation, updateExclusionVariables)
    );

    return exclusion;

    throw new Error(MALFORMED_RESPONSE);
  }
);

export const createExclusion = apiRequestCreator(
  'exclusions/create',
  async (exclusion: Exclusion): Promise<Exclusion> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...exclusionWithoutId } = exclusion;

    const createExclusionVariables: CreateExclusionMutationVariables = {
      input: exclusionWithoutId,
    };

    const createExclusionResult = (await API.graphql(
      graphqlOperation(createExclusionMutation, createExclusionVariables)
    )) as {
      data: {
        createExclusion: Pick<Exclusion, 'id'>;
      };
    };

    return { ...exclusion, id: createExclusionResult.data.createExclusion.id };

    throw new Error(MALFORMED_RESPONSE);
  }
);

export const fetchExclusions = apiRequestCreator(
  'exclusions/fetch',
  async (): Promise<Exclusion[]> => {
    const listExclusionsResult = (await API.graphql(
      graphqlOperation(listExclusionsQuery)
    )) as { data: { listExclusions: Exclusion[] } };

    return listExclusionsResult.data.listExclusions;
  }
);

export const removeExclusion = apiRequestCreator(
  'exclusions/remove',
  async (exclusion: Exclusion): Promise<string> => {
    const deleteExclusionVariables: DeleteExclusionMutationVariables = {
      input: {
        id: exclusion.id,
      },
    };

    await API.graphql(
      graphqlOperation(deleteExclusionMutation, deleteExclusionVariables)
    );

    return exclusion.id;
  }
);

const exclusionsSlice = createSlice({
  name: 'exclusions',
  initialState,
  reducers: {
    clearError: (state): void => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeExclusion.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(updateExclusion.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      const index = state.items.findIndex(
        (item) => action.payload.id === item.id
      );
      state.items[index] = action.payload;
    });

    builder.addCase(createExclusion.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      state.items.push(action.payload);
    });

    builder.addCase(fetchExclusions.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      state.items = action.payload;
    });
  },
});

export default exclusionsSlice;

export const allExclusionsSelector = (state: AppState): Exclusion[] =>
  state.exclusions.items;

import API, { graphqlOperation } from "@aws-amplify/api";

import {
  CreateRecipeMutationVariables,
  DeleteRecipeMutationVariables,
  UpdateRecipeMutationVariables,
} from "../../backend/query-variables-types";

import {
  createRecipeMutation,
  deleteRecipeMutation,
  listRecipesQuery,
  updateRecipeMutation,
} from "./graphql";

import type AppState from "../../types/AppState";

import LoadingState from "../../types/LoadingState";
import Recipe from "../../domain/Recipe";

import apiRequestCreator from "../../lib/apiRequestCreator";
import { createSlice } from "@reduxjs/toolkit";

interface RecipesState {
  items: Recipe[];
  page: number;
  loadingState: LoadingState;
  error?: string;
}

const initialState: RecipesState = {
  items: [],
  page: 0,
  loadingState: LoadingState.Idle,
};

export const updateRecipe = apiRequestCreator(
  "recipes/update",
  async (recipe: Recipe): Promise<Recipe> => {
    const { potentialExclusions, ...recipeWithoutExclusions } = recipe;

    const updateRecipeVariables: UpdateRecipeMutationVariables = {
      input: {
        ...recipeWithoutExclusions,
        exclusionIds: potentialExclusions.map((exclusion) => exclusion.id),
      },
    };

    const updateRecipeResult = (await API.graphql(
      graphqlOperation(updateRecipeMutation, updateRecipeVariables)
    )) as {
      data: { updateRecipe: Pick<Recipe, "potentialExclusions"> };
    };

    return {
      ...recipe,
      potentialExclusions:
        updateRecipeResult.data.updateRecipe.potentialExclusions,
    };
  }
);

export const createRecipe = apiRequestCreator(
  "recipes/create",
  async (recipe: Recipe): Promise<Recipe> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, potentialExclusions, ...recipeWithoutId } = recipe;

    const createRecipeVariables: CreateRecipeMutationVariables = {
      input: {
        ...recipeWithoutId,
        exclusionIds: potentialExclusions.map((exclusion) => exclusion.id),
      },
    };

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(createRecipeVariables));

    const createRecipeResult = (await API.graphql(
      graphqlOperation(createRecipeMutation, createRecipeVariables)
    )) as {
      data: {
        createRecipe: Pick<Recipe, "potentialExclusions" | "id">;
      };
    };

    return {
      ...recipe,
      potentialExclusions:
        createRecipeResult.data.createRecipe.potentialExclusions,
      id: createRecipeResult.data.createRecipe.id,
    };
  }
);

export const fetchRecipes = apiRequestCreator(
  "recipes/fetch",
  async (): Promise<Recipe[]> => {
    const listRecipesResult = (await API.graphql(
      graphqlOperation(listRecipesQuery)
    )) as {
      data: {
        listRecipes: Recipe[];
      };
    };

    return listRecipesResult.data.listRecipes;
  }
);

export const removeRecipe = apiRequestCreator(
  "recipes/remove",
  async (recipe: Recipe): Promise<string> => {
    const deleteRecipeVariables: DeleteRecipeMutationVariables = {
      input: {
        id: recipe.id,
      },
    };

    await API.graphql(
      graphqlOperation(deleteRecipeMutation, deleteRecipeVariables)
    );

    return recipe.id;
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearError: (state): void => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeRecipe.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(updateRecipe.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      const index = state.items.findIndex(
        (item) => action.payload.id === item.id
      );
      state.items[index] = action.payload;
    });

    builder.addCase(createRecipe.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      state.items.push(action.payload);
    });

    builder.addCase(fetchRecipes.fulfilled, (state, action): void => {
      state.loadingState = LoadingState.Succeeeded;
      state.items = action.payload;
    });
  },
});

export default recipesSlice;

export const allRecipesSelector = (state: AppState): Recipe[] =>
  state.recipes.items;

export const errorSelector = (state: AppState): string | undefined =>
  state.recipes.error;

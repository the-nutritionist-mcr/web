import "source-map-support/register";
import * as database from "./database";
import * as uuid from "uuid";
import {
  AllQueryVariables,
  CreateRecipeMutationVariables,
  DeleteRecipeMutationVariables,
  ListRecipesQueryVariables,
  RecipeExclusion,
  UpdateExclusionMutationVariables,
  UpdateRecipeMutationVariables,
} from "./query-variables-types";
import { AppSyncResolverEvent } from "aws-lambda";
import Exclusion from "../domain/Exclusion";
import Recipe from "../domain/Recipe";

export const isListRecipesQuery = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<ListRecipesQueryVariables> => {
  return event.info.fieldName === "listRecipes";
};

const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (value) {
    return value;
  }
  throw new Error(`process.env.${name} not set`);
};

export const listRecipes = async (): Promise<Recipe[]> => {
  const recipesTable = getRequiredEnvVar("RECIPES_TABLE");
  const exclusionsTable = getRequiredEnvVar("EXCLUSIONS_TABLE");
  const recipeExclusionsTable = getRequiredEnvVar("RECIPE_EXCLUSIONS_TABLE");

  const recipeData = (await database.getAll(
    recipesTable
  )) as UpdateRecipeMutationVariables["input"][];

  const recipeExclusionIds = new Set(
    recipeData.flatMap((recipe) => recipe.exclusionIds).filter(Boolean)
  );

  const recipeExclusions = await database.getAllByIds<RecipeExclusion>(
    recipeExclusionsTable,
    Array.from(recipeExclusionIds)
  );

  const exclusions = await database.getAllByIds<Exclusion>(
    exclusionsTable,
    recipeExclusions.map((recipeExclusion) => recipeExclusion.exclusionId)
  );

  const recipes = recipeData
    .map((recipe) => ({
      ...recipe,
      potentialExclusions: recipe.exclusionIds
        .map((id) =>
          recipeExclusions.find((recipeExclusion) => recipeExclusion.id === id)
        )
        .map((recipeExclusion) =>
          exclusions.find(
            (exclusion) => exclusion.id === recipeExclusion?.exclusionId
          )
        )
        .filter(Boolean),
    }))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ exclusionIds, ...recipe }) => recipe);

  // eslint-disable-next-line no-console
  console.log(recipes);
  return recipes as Recipe[];
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const isCreateRecipesQuery = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<CreateRecipeMutationVariables> => {
  return event.info.fieldName === "createRecipe";
};

export const createRecipe = async (
  input: CreateRecipeMutationVariables["input"]
): Promise<Recipe> => {
  const recipesTable = getRequiredEnvVar("RECIPES_TABLE");
  const exclusionsTable = getRequiredEnvVar("EXCLUSIONS_TABLE");
  const recipeExclusionsTable = getRequiredEnvVar("RECIPE_EXCLUSIONS_TABLE");

  const exclusions = await database.getAllByIds<
    UpdateExclusionMutationVariables["input"]
  >(exclusionsTable, input.exclusionIds);

  const recipeId = uuid.v4();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { exclusionIds, ...returnedRecipe } = input;

  const recipeExclusions = exclusions.map((exclusion: Exclusion) => ({
    table: recipeExclusionsTable,
    record: {
      id: uuid.v4(),
      recipeId,
      exclusionId: exclusion.id,
    },
  }));

  const recipe = {
    ...input,
    id: recipeId,
    exclusionIds: recipeExclusions.map((item) => item.record.id),
  };

  const putRecords = [
    {
      table: recipesTable,
      record: recipe,
    },
    ...recipeExclusions,
  ];

  await database.putAll<
    UpdateRecipeMutationVariables["input"] | RecipeExclusion
  >(putRecords);

  const returnVal = {
    ...returnedRecipe,
    id: recipeId,
    potentialExclusions: exclusions,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(returnVal));

  return returnVal;
};

export const deleteRecipe = async (
  input: DeleteRecipeMutationVariables["input"]
): Promise<string> => {
  const recipesTable = getRequiredEnvVar("RECIPES_TABLE");
  const recipeExclusionsTable = getRequiredEnvVar("RECIPE_EXCLUSIONS_TABLE");

  const recipe = (
    await database.getAllByIds<UpdateRecipeMutationVariables["input"]>(
      recipesTable,
      [input.id]
    )
  )[0];

  const recipeExclusionsToDelete = recipe.exclusionIds.map((id) => ({
    table: recipeExclusionsTable,
    id,
  }));

  await database.deleteAll([
    { table: recipesTable, id: input.id },
    ...recipeExclusionsToDelete,
  ]);

  return input.id;
};

export const isDeleteRecipeMutation = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<DeleteRecipeMutationVariables> => {
  return event.info.fieldName === "deleteRecipe";
};

export const updateRecipe = async (
  input: UpdateRecipeMutationVariables["input"]
): Promise<Recipe | null> => {
  const recipesTable = getRequiredEnvVar("RECIPES_TABLE");
  const exclusionsTable = getRequiredEnvVar("EXCLUSIONS_TABLE");
  const recipeExclusionsTable = getRequiredEnvVar("RECIPE_EXCLUSIONS_TABLE");

  const recipeExclusions = await database.getAllByGsis<RecipeExclusion>(
    recipeExclusionsTable,
    "recipeId",
    ["0"]
  );

  const toAdd = input.exclusionIds
    .filter(
      (id) =>
        !recipeExclusions
          .map((recipeExclusion) => recipeExclusion.exclusionId)
          .includes(id)
    )
    .map((id) => ({
      table: recipeExclusionsTable,
      record: { id: uuid.v4(), exclusionId: id, recipeId: input.id },
    }));

  const put = database.putAll(toAdd);

  const toRemove = recipeExclusions
    .filter(
      (recipeExclusion) =>
        !input.exclusionIds.includes(recipeExclusion.exclusionId)
    )
    .map((recipeExclusion) => ({
      table: recipeExclusionsTable,
      id: recipeExclusion.id,
    }));

  const newIds = toAdd.map((item) => item.record.id);

  const remainingIds = recipeExclusions
    .map((item) => item.id)
    .filter((id) => !toRemove.map((item) => item.id).includes(id));

  const finalExclusions = [...remainingIds, ...newIds];

  const remove = database.deleteAll(toRemove);

  const update = database.updateById(recipesTable, input.id, {
    ...input,
    exclusionIds: finalExclusions,
  });

  const exclusions = await database.getAllByIds<Exclusion>(
    exclusionsTable,
    input.exclusionIds
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { exclusionIds, ...returnVal } = input;

  await Promise.all([put, remove, update]);
  return {
    ...returnVal,
    potentialExclusions: exclusions,
  };
};

export const isUpdateRecipeMutation = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<UpdateRecipeMutationVariables> => {
  return event.info.fieldName === "updateRecipe";
};

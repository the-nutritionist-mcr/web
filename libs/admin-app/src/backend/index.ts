import {
  createCustomer,
  deleteCustomer,
  isCreateCustomersQuery,
  isDeleteCustomerMutation,
  isListCustomersQuery,
  isUpdateCustomerMutation,
  listCustomers,
  updateCustomer,
} from "./customers";
import {
  createExclusion,
  deleteExclusion,
  isCreateExclusionMutation,
  isDeleteExclusionMutation,
  isListExclusionsQuery,
  isUpdateExclusionMutation,
  listExclusions,
  updateExclusion,
} from "./exclusions";

import {
  createRecipe,
  deleteRecipe,
  isCreateRecipesQuery,
  isDeleteRecipeMutation,
  isListRecipesQuery,
  isUpdateRecipeMutation,
  listRecipes,
  updateRecipe
} from "./recipes";

import { AllQueryVariables } from "./query-variables-types";
import { AppSyncResolverHandler } from "aws-lambda";
import { logger } from "./logger";

type ExtractPromiseType<P> = P extends Promise<infer T> ? T : never;

type Result =
  | ExtractPromiseType<ReturnType<typeof listCustomers>>
  | ExtractPromiseType<ReturnType<typeof createCustomer>>
  | ExtractPromiseType<ReturnType<typeof deleteCustomer>>
  | ExtractPromiseType<ReturnType<typeof updateCustomer>>
  | ExtractPromiseType<ReturnType<typeof listExclusions>>
  | ExtractPromiseType<ReturnType<typeof createExclusion>>
  | ExtractPromiseType<ReturnType<typeof deleteExclusion>>
  | ExtractPromiseType<ReturnType<typeof updateExclusion>>
  | ExtractPromiseType<ReturnType<typeof createRecipe>>
  | ExtractPromiseType<ReturnType<typeof deleteRecipe>>
  | ExtractPromiseType<ReturnType<typeof listRecipes>>
  | ExtractPromiseType<ReturnType<typeof updateRecipe>>;

/* eslint-disable import/prefer-default-export */
export const handler: AppSyncResolverHandler<AllQueryVariables, Result> =
  async event => {
    if (event.info.parentTypeName === "Mutation") {
      logger.info({
        type: "Mutation",
        user: event.identity?.username,
        operation: event.info.fieldName,
        data: event.info.variables.input
      });
    }

    if (isListCustomersQuery(event)) {
      return await listCustomers();
    }

    if (isCreateCustomersQuery(event)) {
      return await createCustomer(event.arguments.input);
    }

    if (isDeleteCustomerMutation(event)) {
      return await deleteCustomer(event.arguments.input);
    }

    if (isUpdateCustomerMutation(event)) {
      return await updateCustomer(event.arguments.input);
    }

    if (isListExclusionsQuery(event)) {
      return await listExclusions();
    }

    if (isCreateExclusionMutation(event)) {
      return await createExclusion(event.arguments.input);
    }

    if (isUpdateExclusionMutation(event)) {
      return await updateExclusion(event.arguments.input);
    }

    if (isDeleteExclusionMutation(event)) {
      return await deleteExclusion(event.arguments.input);
    }

    if (isCreateRecipesQuery(event)) {
      return await createRecipe(event.arguments.input);
    }

    if (isListRecipesQuery(event)) {
      return await listRecipes();
    }

    if (isUpdateRecipeMutation(event)) {
      return await updateRecipe(event.arguments.input);
    }

    if (isDeleteRecipeMutation(event)) {
      return await deleteRecipe(event.arguments.input);
    }

    throw new Error(`Resolver cannot handle '${event.info.fieldName}'`);
  };

/* eslint-enable import/prefer-default-export */

import Customer from "../domain/Customer";
import Exclusion from "../domain/Exclusion";
import Recipe from "../domain/Recipe";

export interface ListExclusionsQueryVariables {
  input: Record<string, never>;
}

export interface ListCustomersQueryVariables {
  input: Record<string, never>;
}

export interface ListRecipesQueryVariables {
  input: Record<string, never>;
}

export interface DeleteRecipeMutationVariables {
  input: {
    id: string;
  };
}

export interface DeleteCustomerMutationVariables {
  input: {
    id: string;
  };
}

export interface DeleteExclusionMutationVariables {
  input: {
    id: string;
  };
}

export interface CreateRecipeMutationVariables {
  input: Omit<UpdateRecipeMutationVariables["input"], "id">;
}

export interface CreateExclusionMutationVariables {
  input: Omit<UpdateExclusionMutationVariables["input"], "id">;
}

export interface UpdateExclusionMutationVariables {
  input: Exclusion;
}

export interface CreateCustomerMutationVariables {
  input: Omit<UpdateCustomerMutationVariables["input"], "id">;
}

export interface UpdateRecipeMutationVariables {
  input: Omit<Recipe, "potentialExclusions"> & { exclusionIds: string[] };
}

export interface UpdateCustomerMutationVariables {
  input: Omit<Customer, "exclusions"> & { exclusionIds: string[] };
}

export interface RecipeExclusion {
  id: string;
  recipeId: string;
  exclusionId: string;
}

export interface CustomerExclusion {
  id: string;
  customerId: string;
  exclusionId: string;
}

export type AllQueryVariables =
  | ListCustomersQueryVariables
  | ListExclusionsQueryVariables
  | ListRecipesQueryVariables
  | CreateCustomerMutationVariables
  | CreateExclusionMutationVariables
  | CreateRecipeMutationVariables
  | DeleteExclusionMutationVariables
  | DeleteCustomerMutationVariables
  | UpdateCustomerMutationVariables
  | UpdateExclusionMutationVariables
  | UpdateRecipeMutationVariables;

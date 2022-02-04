/* eslint-disable @typescript-eslint/naming-convention */
export interface BackendOutputs {
  [stackName: string]: {
    GraphQlQpiUrl: string;
    RecipesTableName: string;
    RecipeExlusionsTableName: string;
    UserPoolId: string;
    ExclusionsTableName: string;
    AuthUrl: string;
    CustomersTableName: string;
    ClientId: string;
    RedirectUrl: string;
    CustomerExclusionsTableName: string;
  };
}

export const isBackendOutputs = (thing: unknown): thing is BackendOutputs =>
  Object.entries(thing as BackendOutputs).length === 0 ||
  Object.values(thing as BackendOutputs).every((config) =>
    Object.hasOwnProperty.call(config, 'UserPoolId')
  );

export const assertIsBackendOutputs: (
  thing: unknown
) => asserts thing is BackendOutputs = (thing) => {
  if (!isBackendOutputs(thing)) {
    throw new Error(
      `Whoops, the config that was loaded wasn't a valid backend configuration`
    );
  }
};

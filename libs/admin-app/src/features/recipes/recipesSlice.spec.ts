import API, { graphqlOperation } from "@aws-amplify/api";
import { resetAllWhenMocks, when } from "jest-when";
import { fetchRecipes } from "./recipesSlice";

import { listRecipesQuery } from "./graphql";
import { mocked } from "ts-jest/utils";

jest.mock("@aws-amplify/api");

beforeEach(() => {
  resetAllWhenMocks();
});

describe("fetchRecipes", () => {
  it("Dispatches the fullfilled action with the results returend from the GraphQL API", async () => {
    when(mocked(graphqlOperation))
      .calledWith(listRecipesQuery)
      .mockReturnValue({ query: "go-go-go", variables: {}, authToken: "foo" });

    when(mocked(API.graphql))
      .calledWith({ query: "go-go-go", variables: {}, authToken: "foo" })
      .mockResolvedValue({ data: { listRecipes: ["foo", "bar"] } });

    const thunk = fetchRecipes();

    const dispatch = jest.fn();

    await thunk(dispatch, jest.fn(), jest.fn() as unknown as void);

    expect(dispatch).toHaveBeenCalledWith(
      fetchRecipes.fulfilled(["foo", "bar"])
    );
  });
});

import API, { graphqlOperation } from "@aws-amplify/api";
import { resetAllWhenMocks, when } from "jest-when";
import { fetchCustomers } from "./customersSlice";

import { listCustomersQuery } from "./graphql";
import { mocked } from "ts-jest/utils";

jest.mock("@aws-amplify/api");

beforeEach(() => {
  resetAllWhenMocks();
});

describe("fetchCustomers", () => {
  it("Dispatches the fullfilled action with the results returend from the GraphQL API", async () => {
    when(mocked(graphqlOperation))
      .calledWith(listCustomersQuery)
      .mockReturnValue({ query: "go-go-go", variables: {}, authToken: "foo" });

    when(mocked(API.graphql))
      .calledWith({ query: "go-go-go", variables: {}, authToken: "foo" })
      .mockResolvedValue({ data: { listCustomers: ["foo", "bar"] } });

    const thunk = fetchCustomers();

    const dispatch = jest.fn();

    await thunk(dispatch, jest.fn(), jest.fn() as unknown as void);

    expect(dispatch).toHaveBeenCalledWith(
      fetchCustomers.fulfilled(["foo", "bar"])
    );
  });
});

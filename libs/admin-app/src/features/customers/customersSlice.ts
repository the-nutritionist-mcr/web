import API, { graphqlOperation } from "@aws-amplify/api";
import {
  CreateCustomerMutationVariables,
  DeleteCustomerMutationVariables,
  UpdateCustomerMutationVariables,
} from "../../backend/query-variables-types";

const CUSTOMER_SLICE_NAME = "customers";

import {
  createCustomerMutation,
  deleteCustomerMutation,
  listCustomersQuery,
  updateCustomerMutation,
} from "./graphql";

import type AppState from "../../types/AppState";
import Customer from "../../domain/Customer";

import apiRequestCreator from "../../lib/apiRequestCreator";
import { createSlice } from "@reduxjs/toolkit";
import isActive from "../../lib/isActive";

interface CustomersState {
  items: Customer[];
  page: number;
}

const initialState: CustomersState = {
  items: [],
  page: 0,
};

export const updateCustomer = apiRequestCreator(
  `${CUSTOMER_SLICE_NAME}/update`,
  async (customer: Customer): Promise<Customer> => {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exclusions,
      ...customerWithoutExclusions
    } = customer;
    const updateCustomerVariables: UpdateCustomerMutationVariables = {
      input: {
        ...customerWithoutExclusions,
        exclusionIds: exclusions.map((exclusion) => exclusion.id),
      },
    };

    const updateCustomerResult = (await API.graphql(
      graphqlOperation(updateCustomerMutation, updateCustomerVariables)
    )) as {
      data: { updateCustomer: Pick<Customer, "exclusions"> };
    };
    return {
      ...customer,
      exclusions: updateCustomerResult.data.updateCustomer.exclusions,
    };
  }
);

export const createCustomer = apiRequestCreator<Customer, Customer>(
  `${CUSTOMER_SLICE_NAME}/create`,
  async (customer: Customer) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, exclusions, ...customerWithoutExclusions } = customer;
    const createCustomerVariables: CreateCustomerMutationVariables = {
      input: {
        ...customerWithoutExclusions,
        exclusionIds: exclusions.map((exclusion) => exclusion.id),
      },
    };

    const createCustomerResult = (await API.graphql(
      graphqlOperation(createCustomerMutation, createCustomerVariables)
    )) as {
      data: {
        createCustomer: Pick<Customer, "exclusions" | "id">;
      };
    };

    return {
      ...customer,
      exclusions: createCustomerResult.data.createCustomer.exclusions,
      id: createCustomerResult.data.createCustomer.id,
    };
  }
);

export const removeCustomer = apiRequestCreator(
  `${CUSTOMER_SLICE_NAME}/remove`,
  async (customer: Customer): Promise<string> => {
    const deleteCustomerVariables: DeleteCustomerMutationVariables = {
      input: {
        id: customer.id,
      },
    };

    await API.graphql(
      graphqlOperation(deleteCustomerMutation, deleteCustomerVariables)
    );
    return customer.id;
  }
);

export const fetchCustomers = apiRequestCreator<Customer[]>(
  `${CUSTOMER_SLICE_NAME}/fetch`,
  async () => {
    const listCustomersResult = (await API.graphql(
      graphqlOperation(listCustomersQuery)
    )) as {
      data: {
        listCustomers: Customer[];
      };
    };

    return listCustomersResult.data.listCustomers;
  }
);

const customersSlice = createSlice({
  name: CUSTOMER_SLICE_NAME,
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(removeCustomer.fulfilled, (state, action): void => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(updateCustomer.fulfilled, (state, action): void => {
      const index = state.items.findIndex(
        (item) => action.payload.id === item.id
      );
      state.items[index] = action.payload;
    });

    builder.addCase(createCustomer.fulfilled, (state, action): void => {
      state.items.push(action.payload);
    });

    builder.addCase(fetchCustomers.fulfilled, (state, action): void => {
      state.items = action.payload;
    });
  },
});

export const asyncActions = [
  fetchCustomers,
  createCustomer,
  updateCustomer,
  removeCustomer,
];

export default customersSlice;

export const customerByIdSelector =
  (id: string) =>
  (state: AppState): Customer | undefined =>
    state.customers.items.find((customer) => customer.id === id);

export const allCustomersSelector = (state: AppState): Customer[] =>
  state.customers.items;

export const pausedCustomersSelector = (state: AppState): Customer[] =>
  state.customers.items.filter((customer) => !isActive(customer));

export const currentltActiveCustomersSelector = (state: AppState): Customer[] =>
  state.customers.items.filter((customer) => isActive(customer));

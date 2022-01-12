import "source-map-support/register";
import * as database from "./database";
import * as uuid from "uuid";
import {
  AllQueryVariables,
  CreateCustomerMutationVariables,
  CustomerExclusion,
  DeleteCustomerMutationVariables,
  ListCustomersQueryVariables,
  UpdateCustomerMutationVariables,
  UpdateExclusionMutationVariables,
} from "./query-variables-types";
import { AppSyncResolverEvent } from "aws-lambda";
import Customer from "../domain/Customer";
import Exclusion from "../domain/Exclusion";

export const isListCustomersQuery = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<ListCustomersQueryVariables> => {
  return event.info.fieldName === "listCustomers";
};

const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (value) {
    return value;
  }
  throw new Error(`process.env.${name} not set`);
};

export const listCustomers = async (): Promise<Customer[]> => {
  const customersTable = getRequiredEnvVar("CUSTOMERS_TABLE");
  const exclusionsTable = getRequiredEnvVar("EXCLUSIONS_TABLE");
  const customerExclusionsTable = getRequiredEnvVar(
    "CUSTOMER_EXCLUSIONS_TABLE"
  );

  const customerData = (await database.getAll(
    customersTable
  )) as UpdateCustomerMutationVariables["input"][];

  const customerExclusionIds = new Set(
    customerData.flatMap((customer) => customer.exclusionIds).filter(Boolean)
  );

  const customerExclusions = await database.getAllByIds<CustomerExclusion>(
    customerExclusionsTable,
    Array.from(customerExclusionIds)
  );

  const exclusions = await database.getAllByIds<Exclusion>(
    exclusionsTable,
    customerExclusions.map((customerExclusion) => customerExclusion.exclusionId)
  );

  const customers = customerData
    .map((customer) => ({
      ...customer,
      exclusions: customer.exclusionIds
        .map((id) =>
          customerExclusions.find(
            (customerExclusion) => customerExclusion.id === id
          )
        )
        .map((customerExclusion) =>
          exclusions.find(
            (exclusion) => exclusion.id === customerExclusion?.exclusionId
          )
        )
        .filter(Boolean),
    }))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ exclusionIds, ...customer }) => customer);

  return customers as Customer[];
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const isCreateCustomersQuery = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<CreateCustomerMutationVariables> => {
  return event.info.fieldName === "createCustomer";
};

export const createCustomer = async (
  input: CreateCustomerMutationVariables["input"]
): Promise<Customer> => {
  const customersTable = getRequiredEnvVar("CUSTOMERS_TABLE");
  const exclusionsTable = getRequiredEnvVar("EXCLUSIONS_TABLE");
  const customerExclusionsTable = getRequiredEnvVar(
    "CUSTOMER_EXCLUSIONS_TABLE"
  );

  const exclusions = await database.getAllByIds<
    UpdateExclusionMutationVariables["input"]
  >(exclusionsTable, input.exclusionIds);

  const customerId = uuid.v4();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { exclusionIds, ...returnedCustomer } = input;

  const customerExclusions = exclusions.map((exclusion: Exclusion) => ({
    table: customerExclusionsTable,
    record: {
      id: uuid.v4(),
      customerId,
      exclusionId: exclusion.id,
    },
  }));

  const customer = {
    ...input,
    id: customerId,
    exclusionIds: customerExclusions.map((item) => item.record.id),
  };

  const putRecords = [
    {
      table: customersTable,
      record: customer,
    },
    ...customerExclusions,
  ];

  await database.putAll<
    UpdateCustomerMutationVariables["input"] | CustomerExclusion
  >(putRecords);

  return {
    ...returnedCustomer,
    id: customerId,
    exclusions,
  };
};

export const deleteCustomer = async (
  input: DeleteCustomerMutationVariables["input"]
): Promise<string> => {
  const customersTable = getRequiredEnvVar("CUSTOMERS_TABLE");
  const customerExclusionsTable = getRequiredEnvVar(
    "CUSTOMER_EXCLUSIONS_TABLE"
  );

  const customer = (
    await database.getAllByIds<UpdateCustomerMutationVariables["input"]>(
      customersTable,
      [input.id]
    )
  )[0];

  const customerExclusionsToDelete = customer.exclusionIds.map((id) => ({
    table: customerExclusionsTable,
    id,
  }));

  await database.deleteAll([
    { table: customersTable, id: input.id },
    ...customerExclusionsToDelete,
  ]);

  return input.id;
};

export const isDeleteCustomerMutation = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<DeleteCustomerMutationVariables> => {
  return event.info.fieldName === "deleteCustomer";
};

export const updateCustomer = async (
  input: UpdateCustomerMutationVariables["input"]
): Promise<Customer | null> => {
  const customersTable = getRequiredEnvVar("CUSTOMERS_TABLE");
  const exclusionsTable = getRequiredEnvVar("EXCLUSIONS_TABLE");
  const customerExclusionsTable = getRequiredEnvVar(
    "CUSTOMER_EXCLUSIONS_TABLE"
  );

  const customerExclusions = await database.getAllByGsis<CustomerExclusion>(
    customerExclusionsTable,
    "customerId",
    ["0"]
  );

  const toAdd = input.exclusionIds
    .filter(
      (id) =>
        !customerExclusions
          .map((customerExclusion) => customerExclusion.exclusionId)
          .includes(id)
    )
    .map((id) => ({
      table: customerExclusionsTable,
      record: { id: uuid.v4(), exclusionId: id, customerId: input.id },
    }));

  const put = database.putAll(toAdd);

  const toRemove = customerExclusions
    .filter(
      (customerExclusion) =>
        !input.exclusionIds.includes(customerExclusion.exclusionId)
    )
    .map((customerExclusion) => ({
      table: customerExclusionsTable,
      id: customerExclusion.id,
    }));

  const newIds = toAdd.map((item) => item.record.id);

  const remainingIds = customerExclusions
    .map((item) => item.id)
    .filter((id) => !toRemove.map((item) => item.id).includes(id));

  const finalExclusions = [...remainingIds, ...newIds];

  const remove = database.deleteAll(toRemove);

  const update = database.updateById(customersTable, input.id, {
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
    exclusions,
  };
};

export const isUpdateCustomerMutation = (
  event: AppSyncResolverEvent<AllQueryVariables>
): event is AppSyncResolverEvent<UpdateCustomerMutationVariables> => {
  return event.info.fieldName === "updateCustomer";
};

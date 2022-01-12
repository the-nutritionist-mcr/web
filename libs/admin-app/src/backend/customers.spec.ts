import * as customers from "./customers";
import * as database from "./database";
import * as uuid from "uuid";
import {
  CreateCustomerMutationVariables,
  CustomerExclusion,
  DeleteCustomerMutationVariables,
  UpdateCustomerMutationVariables,
  UpdateExclusionMutationVariables,
} from "./query-variables-types";
import { resetAllWhenMocks, when } from "jest-when";
import { Snack } from "../domain/Customer";
import { mocked } from "ts-jest/utils";

jest.mock("./database");
jest.mock("uuid");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  resetAllWhenMocks();
  delete process.env.CUSTOMERS_TABLE;
  delete process.env.EXCLUSIONS_TABLE;
  delete process.env.CUSTOMER_EXCLUSIONS_TABLE;
});

describe("listCustomers", () => {
  it("Rejects the promise if CUSTOMERS_TABLE is not set", async () => {
    process.env.EXCLUSIONS_TABLE = "bar";
    await expect(customers.listCustomers()).rejects.toThrow(
      new Error("process.env.CUSTOMERS_TABLE not set")
    );
  });

  it("Rejects the promise if EXCLUSIONS_TABLE is not set", async () => {
    process.env.CUSTOMERS_TABLE = "foo";
    await expect(customers.listCustomers()).rejects.toThrow(
      new Error("process.env.EXCLUSIONS_TABLE not set")
    );
  });

  it("Given that getAll returns customers without exclusions, it just returns them", async () => {
    process.env.CUSTOMERS_TABLE = "customers-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";

    const mockCustomers: UpdateCustomerMutationVariables["input"][] = [
      {
        id: "0",
        firstName: "Ben",
        surname: "Wainwright",
        salutation: "mr",
        address: "",
        telephone: "123",
        email: "a@b.c",
        daysPerWeek: 3,
        plan: {
          name: "Mass 2",
          mealsPerDay: 2,
          category: "Mass",
          costPerMeal: 200,
        },
        snack: Snack.Large,
        breakfast: true,
        exclusionIds: [],
      },

      {
        id: "1",
        firstName: "James",
        surname: "Evans",
        salutation: "mr",
        address: "",
        telephone: "123",
        email: "a@b.c",
        daysPerWeek: 3,
        plan: {
          name: "Mass 2",
          mealsPerDay: 2,
          category: "Mass",
          costPerMeal: 200,
        },
        snack: Snack.Large,
        breakfast: true,
        exclusionIds: [],
      },

      {
        id: "2",
        firstName: "Chris",
        surname: "Davis",
        salutation: "mr",
        address: "",
        telephone: "123",
        email: "a@b.c",
        daysPerWeek: 3,
        plan: {
          name: "Mass 2",
          mealsPerDay: 2,
          category: "Mass",
          costPerMeal: 200,
        },
        snack: Snack.Large,
        breakfast: true,
        exclusionIds: [],
      },
    ];

    when(mocked(database.getAllByIds, true))
      .calledWith("customer-exclusions-table", expect.anything())
      .mockResolvedValue([]);

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.anything())
      .mockResolvedValue([]);

    when(mocked(database.getAll, true))
      .calledWith("customers-table")
      .mockResolvedValue(mockCustomers);

    const result = await customers.listCustomers();
    expect(result).toBeTruthy();
    expect(result).toHaveLength(3);
    expect(result[1].exclusions).toHaveLength(0);
    expect(
      (result as unknown as Record<string, unknown>)["exclusionIds"]
    ).not.toBeDefined();
  });

  it("Given getAll returns customers with exclusions, it merges them", async () => {
    process.env.CUSTOMERS_TABLE = "customers-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";

    const mockExclusions: UpdateExclusionMutationVariables["input"][] = [
      {
        id: "1",
        name: "foo",
        allergen: true,
      },
      {
        id: "2",
        name: "bar",
        allergen: false,
      },
      {
        id: "3",
        name: "baz",
        allergen: false,
      },
      {
        id: "4",
        name: "bap",
        allergen: false,
      },
    ];

    const customerExclusions: CustomerExclusion[] = [
      {
        id: "8",
        customerId: "0",
        exclusionId: "1",
      },
      {
        id: "10",
        exclusionId: "3",
        customerId: "0",
      },
      {
        id: "15",
        exclusionId: "4",
        customerId: "0",
      },
      {
        id: "21",
        exclusionId: "1",
        customerId: "0",
      },
    ];

    const mockCustomers: UpdateCustomerMutationVariables["input"][] = [
      {
        id: "0",
        firstName: "Ben",
        surname: "Wainwright",
        salutation: "mr",
        address: "",
        telephone: "123",
        email: "a@b.c",
        daysPerWeek: 3,
        plan: {
          name: "Mass 2",
          mealsPerDay: 2,
          category: "Mass",
          costPerMeal: 200,
        },
        snack: Snack.Large,
        breakfast: true,
        exclusionIds: ["8", "10"],
      },

      {
        id: "1",
        firstName: "James",
        surname: "Evans",
        salutation: "mr",
        address: "",
        telephone: "123",
        email: "a@b.c",
        daysPerWeek: 3,
        plan: {
          name: "Mass 2",
          mealsPerDay: 2,
          category: "Mass",
          costPerMeal: 200,
        },
        snack: Snack.Large,
        breakfast: true,
        exclusionIds: ["15", "21"],
      },

      {
        id: "2",
        firstName: "Chris",
        surname: "Davis",
        salutation: "mr",
        address: "",
        telephone: "123",
        email: "a@b.c",
        daysPerWeek: 3,
        plan: {
          name: "Mass 2",
          mealsPerDay: 2,
          category: "Mass",
          costPerMeal: 200,
        },
        snack: Snack.Large,
        breakfast: true,
        exclusionIds: [],
      },
    ];

    when(mocked(database.getAll, true))
      .calledWith("customers-table")
      .mockResolvedValue(mockCustomers);

    when(mocked(database.getAllByIds, true))
      .calledWith(
        "customer-exclusions-table",
        expect.arrayContaining(["8", "10", "15", "21"])
      )
      .mockResolvedValue(
        customerExclusions as unknown as Record<string, unknown>[]
      );

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining(["1", "3", "4"]))
      .mockResolvedValue(
        mockExclusions as unknown as Record<string, unknown>[]
      );

    const result = await customers.listCustomers();
    expect(result).toBeTruthy();

    expect(result).toHaveLength(3);
    expect(result[0].exclusions).toHaveLength(2);
    expect(result[1].exclusions[1].name).toEqual("foo");
  });
});

describe("Createcustomer", () => {
  it("Calls putAll with the customer and the expected customerExclusions if there is some and returns it", async () => {
    let called = 0;

    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const mockExclusions: UpdateExclusionMutationVariables["input"][] = [
      {
        id: "3",
        name: "baz",
        allergen: false,
      },
      {
        id: "4",
        name: "bap",
        allergen: false,
      },
    ];

    process.env.CUSTOMERS_TABLE = "customers-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";
    const customer: CreateCustomerMutationVariables["input"] = {
      firstName: "Chris",
      surname: "Davis",
      salutation: "mr",
      address: "",
      telephone: "123",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: ["4", "3"],
    };

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining(["4", "3"]))
      .mockResolvedValue(
        mockExclusions as unknown as Record<string, unknown>[]
      );

    const returnedCustomer = await customers.createCustomer(customer);
    expect(mocked(database.putAll, true)).toHaveBeenCalledWith([
      {
        table: "customers-table",
        record: {
          id: "called-1",
          firstName: "Chris",
          surname: "Davis",
          salutation: "mr",
          address: "",
          telephone: "123",
          email: "a@b.c",
          daysPerWeek: 3,
          plan: {
            name: "Mass 2",
            mealsPerDay: 2,
            category: "Mass",
            costPerMeal: 200,
          },
          snack: Snack.Large,
          breakfast: true,
          exclusionIds: ["called-2", "called-3"],
        },
      },
      {
        table: "customer-exclusions-table",
        record: {
          id: "called-2",
          customerId: "called-1",
          exclusionId: "3",
        },
      },
      {
        table: "customer-exclusions-table",
        record: {
          id: "called-3",
          customerId: "called-1",
          exclusionId: "4",
        },
      },
    ]);

    expect(returnedCustomer).toBeTruthy();
    expect(returnedCustomer.id).toEqual("called-1");
    expect(returnedCustomer.surname).toEqual("Davis");
    expect(returnedCustomer.exclusions).toBeTruthy();
    expect(returnedCustomer.exclusions[0].name).toEqual("baz");
    expect(returnedCustomer.exclusions[1].name).toEqual("bap");
  });
  it("Calls putAll with the customer if there is no exclusions and returns it", async () => {
    process.env.CUSTOMERS_TABLE = "customers-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";
    const customer: CreateCustomerMutationVariables["input"] = {
      firstName: "Chris",
      surname: "Davis",
      salutation: "mr",
      address: "",
      telephone: "123",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: [],
    };

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining([]))
      .mockResolvedValue([]);

    mocked(uuid.v4).mockReturnValue("the-id");
    const returnedCustomer = await customers.createCustomer(customer);
    expect(mocked(database.putAll, true)).toHaveBeenCalledWith([
      {
        table: "customers-table",
        record: {
          id: "the-id",
          firstName: "Chris",
          surname: "Davis",
          salutation: "mr",
          address: "",
          telephone: "123",
          email: "a@b.c",
          daysPerWeek: 3,
          plan: {
            name: "Mass 2",
            mealsPerDay: 2,
            category: "Mass",
            costPerMeal: 200,
          },
          snack: Snack.Large,
          breakfast: true,
          exclusionIds: [],
        },
      },
    ]);

    expect(returnedCustomer).toBeTruthy();
    expect(returnedCustomer.id).toEqual("the-id");
    expect(returnedCustomer.surname).toEqual("Davis");
  });

  it("Rejects the promise if CUSTOMERS_TABLE is not set", async () => {
    process.env.EXCLUSIONS_TABLE = "bar";
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "foo";
    await expect(
      customers.createCustomer(
        {} as unknown as CreateCustomerMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.CUSTOMERS_TABLE not set"));
  });

  it("Rejects the promise if CUSTOMER_EXCLUSIONS_TABLE is not set", async () => {
    process.env.EXCLUSIONS_TABLE = "bar";
    process.env.CUSTOMERS_TABLE = "foo";
    await expect(
      customers.createCustomer(
        {} as unknown as CreateCustomerMutationVariables["input"]
      )
    ).rejects.toThrow(
      new Error("process.env.CUSTOMER_EXCLUSIONS_TABLE not set")
    );
  });

  it("Rejects the promise if EXCLUSIONS_TABLE is not set", async () => {
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "foo";
    process.env.CUSTOMERS_TABLE = "foo";
    await expect(
      customers.createCustomer(
        {} as unknown as CreateCustomerMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.EXCLUSIONS_TABLE not set"));
  });
});

describe("Update customer", () => {
  it("Returns the changed customer including merged exclusions", async () => {
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";
    process.env.CUSTOMERS_TABLE = "customers-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const mockExclusions: UpdateExclusionMutationVariables["input"][] = [
      {
        id: "2",
        name: "baz",
        allergen: false,
      },
      {
        id: "3",
        name: "bap",
        allergen: false,
      },
    ];

    const customerExclusions: CustomerExclusion[] = [
      {
        id: "10",
        exclusionId: "3",
        customerId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        customerId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "customer-exclusions-table",
        "customerId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        customerExclusions as unknown as Record<string, unknown>[]
      );

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining(["2", "3"]))
      .mockResolvedValue(
        mockExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateCustomerMutationVariables["input"] = {
      id: "0",
      firstName: "Chris",
      surname: "Davis",
      salutation: "mr",
      address: "",
      telephone: "999",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: ["2", "3"],
    };
    const customer = await customers.updateCustomer(input);

    expect(customer).toBeDefined();
    if (customer) {
      expect(customer.address).toEqual("");
      expect(customer.telephone).toEqual("999");
      expect(
        (customer as unknown as UpdateCustomerMutationVariables["input"])
          .exclusionIds
      ).toBeUndefined();
      expect(customer.exclusions).toHaveLength(2);
      expect(customer.exclusions[0].name).toEqual("baz");
    }
  });

  it("Updates the customer if there are no exclusions to be changed", async () => {
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.CUSTOMERS_TABLE = "customers-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const customerExclusions: CustomerExclusion[] = [
      {
        id: "10",
        exclusionId: "3",
        customerId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        customerId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "customer-exclusions-table",
        "customerId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        customerExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateCustomerMutationVariables["input"] = {
      id: "0",
      firstName: "Chris",
      surname: "Davis",
      salutation: "mr",
      address: "",
      telephone: "999",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: ["2", "3"],
    };
    await customers.updateCustomer(input);

    expect(database.deleteAll).toHaveBeenCalledWith([]);
    expect(database.putAll).toHaveBeenCalledWith([]);

    const toInsert = {
      ...input,
      exclusionIds: expect.arrayContaining(["15", "10"]),
    };

    expect(database.updateById).toHaveBeenCalledWith(
      "customers-table",
      "0",
      toInsert
    );
  });

  it("Updates the customer and removes exclusions if some need to be removed", async () => {
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";
    process.env.EXCLUSIONS_TABLE = "customers-table";
    process.env.CUSTOMERS_TABLE = "customers-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const customerExclusions: CustomerExclusion[] = [
      {
        id: "8",
        customerId: "0",
        exclusionId: "0",
      },
      {
        id: "10",
        exclusionId: "3",
        customerId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        customerId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "customer-exclusions-table",
        "customerId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        customerExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateCustomerMutationVariables["input"] = {
      id: "0",
      firstName: "Chris",
      surname: "Davis",
      salutation: "mr",
      address: "",
      telephone: "999",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: ["2"],
    };
    await customers.updateCustomer(input);

    expect(database.deleteAll).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          table: "customer-exclusions-table",
          id: "10",
        },
        {
          table: "customer-exclusions-table",
          id: "8",
        },
      ])
    );

    const toInsert = {
      ...input,
      exclusionIds: ["15"],
    };

    expect(database.updateById).toHaveBeenCalledWith(
      "customers-table",
      "0",
      toInsert
    );
  });

  it("Updates the customer and adds exclusions if some need to be added", async () => {
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";
    process.env.CUSTOMERS_TABLE = "customers-table";
    process.env.EXCLUSIONS_TABLE = "customers-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const customerExclusions: CustomerExclusion[] = [
      {
        id: "10",
        exclusionId: "3",
        customerId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        customerId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "customer-exclusions-table",
        "customerId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        customerExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateCustomerMutationVariables["input"] = {
      id: "0",
      firstName: "Chris",
      surname: "Davis",
      salutation: "mr",
      address: "",
      telephone: "789",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: ["2", "3", "4"],
    };

    const inDataBase: UpdateCustomerMutationVariables["input"] = {
      id: "0",
      firstName: "Chris",
      surname: "Davis",
      salutation: "mr",
      address: "",
      telephone: "123",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: ["10", "15"],
    };

    await customers.updateCustomer(input);

    expect(database.putAll).toHaveBeenCalledWith([
      {
        table: "customer-exclusions-table",
        record: {
          id: "called-1",
          exclusionId: "4",
          customerId: "0",
        },
      },
    ]);

    const toInsert = {
      ...input,
      exclusionIds: [...inDataBase.exclusionIds, "called-1"],
    };

    expect(database.updateById).toHaveBeenCalledWith(
      "customers-table",
      "0",
      toInsert
    );
  });
});

describe("Delete customer", () => {
  it("Rejects the promise if CUSTOMERS_TABLE is not set", async () => {
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "foo";
    await expect(
      customers.deleteCustomer(
        {} as unknown as DeleteCustomerMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.CUSTOMERS_TABLE not set"));
  });

  it("Rejects the promise if CUSTOMER_EXCLUSIONS_TABLE is not set", async () => {
    process.env.CUSTOMERS_TABLE = "foo";
    await expect(
      customers.deleteCustomer(
        {} as unknown as DeleteCustomerMutationVariables["input"]
      )
    ).rejects.toThrow(
      new Error("process.env.CUSTOMER_EXCLUSIONS_TABLE not set")
    );
  });

  it("Calls deleteall with the id of the customer and any assocated customer exclusions", async () => {
    process.env.CUSTOMER_EXCLUSIONS_TABLE = "customer-exclusions-table";
    process.env.CUSTOMERS_TABLE = "customers-table";

    const customer: UpdateCustomerMutationVariables["input"] = {
      id: "0",
      firstName: "Ben",
      surname: "Wainwright",
      salutation: "mr",
      address: "",
      telephone: "123",
      email: "a@b.c",
      daysPerWeek: 3,
      plan: {
        name: "Mass 2",
        mealsPerDay: 2,
        category: "Mass",
        costPerMeal: 200,
      },
      snack: Snack.Large,
      breakfast: true,
      exclusionIds: ["8", "10"],
    };

    when(mocked(database.getAllByIds))
      .calledWith("customers-table", ["0"])
      .mockResolvedValue([customer]);

    await customers.deleteCustomer({ id: "0" });

    expect(database.deleteAll).toHaveBeenCalledWith([
      {
        table: "customers-table",
        id: "0",
      },
      {
        table: "customer-exclusions-table",
        id: "8",
      },
      {
        table: "customer-exclusions-table",
        id: "10",
      },
    ]);
  });
});

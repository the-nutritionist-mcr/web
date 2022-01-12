import React from "react";
import { mocked } from "ts-jest/utils";
import { render, screen, within } from "@testing-library/react";
import Finalize from "../features/planner/Finalize";
import Recipe from "../domain/Recipe";
import { mock } from "jest-mock-extended";
import { when } from "jest-when";
import { useSelector } from "react-redux";
import {
  customerSelectionsSelector,
  plannedMealsSelector,
} from "../features/planner/planner-reducer";
import Customer from "../domain/Customer";
import { Grommet } from "grommet";
import { CustomerPlan } from "../features/customers/types";

const FakeLink: React.FC = (props) => <>{props.children}</>;

jest.mock("react-redux");
jest.mock("react-router-dom", () => ({ Link: FakeLink }));

test("the finalize component displays the customer name at the top of each table", () => {
  const r = mock<Recipe>();
  r.name = "baz";
  r.id = "2";
  r.description = "baz";
  r.shortName = "ab";

  const r1 = mock<Recipe>();
  r1.name = "bap";
  r1.id = "3";
  r1.description = "bap";
  r1.shortName = "bb";

  const r2 = mock<Recipe>();
  r2.name = "bar";
  r2.id = "3";
  r2.description = "bar";
  r2.shortName = "cc";

  const r3 = mock<Recipe>();
  r3.name = "beeee";
  r3.id = "3";
  r3.description = "beeee";
  r3.shortName = "dd";

  const mockPlan = mock<CustomerPlan>();
  mockPlan.configuration = {
    planType: "EQ",
    daysPerWeek: 7,
    mealsPerDay: 3,
    totalPlans: 1,
    deliveryDays: [],
    extrasChosen: []
  };

  mockPlan.deliveries = [];

  const c = mock<Customer>();
  c.firstName = "Chris";
  c.id = "0";
  c.surname = "Blogs";
  c.newPlan = mockPlan;

  const c1 = mock<Customer>();
  c1.firstName = "Joe";
  c1.id = "1";
  c1.newPlan = mockPlan;
  c1.surname = "Smith";

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(plannedMealsSelector as any)
    .mockReturnValue([
      [r, r1],
      [r2, r3],
    ]);

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(customerSelectionsSelector as any)
    .mockReturnValue([
      {
        customer: c,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "EQ",
            },
            {
              recipe: r1,
              chosenVariant: "EQ",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "Mass",
            },
            {
              recipe: r3,
              chosenVariant: "Mass",
            },
          ],
        ],
      },

      {
        customer: c1,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r1,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "EQ",
            },
            {
              recipe: r3,
              chosenVariant: "EQ",
            },
          ],
        ],
      },
    ]);

  render(
    <Grommet>
      <Finalize />
    </Grommet>
  );

  const customerTables = screen.getAllByRole("table");
  const name = within(
    within(customerTables[0]).getAllByRole("row")[0]
  ).queryByText("Chris Blogs");
  expect(name).toBeInTheDocument();
});

test("the finalize component displays at least one labelled row for each delivery", () => {
  const r = mock<Recipe>();
  r.name = "baz";
  r.id = "2";
  r.description = "baz";
  r.shortName = "aa";

  const r1 = mock<Recipe>();
  r1.name = "bap";
  r1.id = "3";
  r1.description = "bap";
  r1.shortName = "ab";

  const r2 = mock<Recipe>();
  r2.name = "bar";
  r2.id = "3";
  r2.description = "bar";
  r2.shortName = "ac";

  const r3 = mock<Recipe>();
  r3.name = "beeee";
  r3.id = "3";
  r3.description = "beeee";
  r3.shortName = "ad";

  const mockPlan = mock<CustomerPlan>();
  mockPlan.configuration = {
    planType: "EQ",
    daysPerWeek: 7,
    mealsPerDay: 3,
    totalPlans: 1,
    deliveryDays: [],
    extrasChosen: []
  };

  mockPlan.deliveries = [];

  const c = mock<Customer>();
  c.id = "0";
  c.firstName = "Chris";
  c.surname = "Blogs";
  c.newPlan = mockPlan;

  const c1 = mock<Customer>();
  c1.id = "1";
  c1.firstName = "Joe";
  c1.surname = "Smith";
  c1.newPlan = mockPlan;

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(plannedMealsSelector as any)
    .mockReturnValue([
      [r, r1],
      [r2, r3],
    ]);

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(customerSelectionsSelector as any)
    .mockReturnValue([
      {
        customer: c,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "EQ",
            },
            {
              recipe: r1,
              chosenVariant: "EQ",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "Mass",
            },
            {
              recipe: r3,
              chosenVariant: "Mass",
            },
          ],
        ],
      },

      {
        customer: c1,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r1,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "EQ",
            },
            {
              recipe: r3,
              chosenVariant: "EQ",
            },
          ],
        ],
      },
    ]);

  render(
    <Grommet>
      <Finalize />
    </Grommet>
  );

  const customerTables = screen.getAllByRole("table");
  const tableRows = within(customerTables[0]).getAllByRole("rowheader");
  expect(tableRows).toHaveLength(2);
  expect(within(tableRows[0]).queryByText("1")).toBeInTheDocument();
  expect(within(tableRows[1]).queryByText("2")).toBeInTheDocument();
});

test("The finalize component breaks rows that are longer than six items into multiple rows", () => {
  const r = mock<Recipe>();
  r.name = "baz";
  r.id = "2";
  r.description = "baz";
  r.shortName = "aa";

  const r1 = mock<Recipe>();
  r1.name = "bap";
  r1.id = "3";
  r1.description = "bap";
  r1.shortName = "ab";

  const r2 = mock<Recipe>();
  r2.name = "bar";
  r2.id = "3";
  r2.description = "bar";
  r2.shortName = "ac";

  const r3 = mock<Recipe>();
  r3.name = "beeee";
  r3.id = "3";
  r3.description = "beeee";
  r3.shortName = "ad";

  const mockPlan = mock<CustomerPlan>();
  mockPlan.configuration = {
    planType: "EQ",
    daysPerWeek: 7,
    mealsPerDay: 3,
    totalPlans: 1,
    deliveryDays: [],
    extrasChosen: []
  };

  mockPlan.deliveries = [];

  const c = mock<Customer>();
  c.id = "0";
  c.firstName = "Chris";
  c.surname = "Blogs";
  c.newPlan = mockPlan;

  const c1 = mock<Customer>();
  c1.id = "1";
  c1.firstName = "Joe";
  c1.surname = "Smith";
  c1.newPlan = mockPlan;

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(plannedMealsSelector as any)
    .mockReturnValue([
      [r, r1],
      [r2, r3],
    ]);

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(customerSelectionsSelector as any)
    .mockReturnValue([
      {
        customer: c,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "EQ",
            },
            {
              recipe: r1,
              chosenVariant: "EQ",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "Mass",
            },
            {
              recipe: r3,
              chosenVariant: "Mass",
            },
          ],
        ],
      },

      {
        customer: c1,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r1,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "EQ",
            },
            {
              recipe: r3,
              chosenVariant: "EQ",
            },
          ],
        ],
      },
    ]);

  render(
    <Grommet>
      <Finalize />
    </Grommet>
  );

  const customerTables = screen.getAllByRole("table");
  const tableRows = within(customerTables[0]).getAllByRole("rowheader");
  expect(tableRows).toHaveLength(3);
  expect(within(tableRows[0]).queryByText("1")).toBeInTheDocument();
  expect(within(tableRows[2]).queryByText("2")).toBeInTheDocument();
});

test("The finalize component does not display the string 'multiple' in any of the text boxes", () => {
  const r = mock<Recipe>();
  r.name = "baz";
  r.id = "2";
  r.description = "baz";
  r.shortName = "aa";

  const r1 = mock<Recipe>();
  r1.name = "bap";
  r1.id = "3";
  r1.description = "bap";
  r1.shortName = "ab";

  const r2 = mock<Recipe>();
  r2.name = "bar";
  r2.id = "3";
  r2.description = "bar";
  r2.shortName = "ac";

  const r3 = mock<Recipe>();
  r3.name = "beeee";
  r3.id = "3";
  r3.description = "beeee";
  r3.shortName = "ad";

  const mockPlan = mock<CustomerPlan>();
  mockPlan.configuration = {
    planType: "EQ",
    daysPerWeek: 7,
    mealsPerDay: 3,
    totalPlans: 1,
    deliveryDays: [],
    extrasChosen: []
  };

  mockPlan.deliveries = [];
  const c = mock<Customer>();
  c.id = "0";
  c.firstName = "Chris";
  c.surname = "Blogs";
  c.newPlan = mockPlan;

  const c1 = mock<Customer>();
  c1.id = "1";
  c1.firstName = "Joe";
  c1.surname = "Smith";
  c1.newPlan = mockPlan;

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(plannedMealsSelector as any)
    .mockReturnValue([
      [r, r1],
      [r2, r3],
    ]);

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(customerSelectionsSelector as any)
    .mockReturnValue([
      {
        customer: c,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "EQ",
            },
            {
              recipe: r1,
              chosenVariant: "EQ",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "Mass",
            },
            {
              recipe: r3,
              chosenVariant: "Mass",
            },
          ],
        ],
      },

      {
        customer: c1,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r1,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "EQ",
            },
            {
              recipe: r3,
              chosenVariant: "EQ",
            },
          ],
        ],
      },
    ]);

  render(
    <Grommet>
      <Finalize />
    </Grommet>
  );

  const multiple = screen.queryAllByDisplayValue("multiple");
  expect(multiple).toHaveLength(0);
});

test("The finalize component displays the selected meals for the customer is the active item in select boxes", () => {
  const r = mock<Recipe>();
  r.name = "baz";
  r.id = "2";
  r.description = "baz";
  r.shortName = "aa";

  const r1 = mock<Recipe>();
  r1.name = "bap";
  r1.id = "3";
  r1.description = "bap";
  r1.shortName = "ab";

  const r2 = mock<Recipe>();
  r2.name = "bar";
  r2.id = "3";
  r2.description = "bar";
  r2.shortName = "ac";

  const r3 = mock<Recipe>();
  r3.name = "beeee";
  r3.id = "3";
  r3.description = "beeee";
  r3.shortName = "ad";

  const mockPlan = mock<CustomerPlan>();
  mockPlan.configuration = {
    planType: "EQ",
    daysPerWeek: 7,
    mealsPerDay: 3,
    totalPlans: 1,
    deliveryDays: [],
    extrasChosen: []
  };

  mockPlan.deliveries = [];

  const c = mock<Customer>();
  c.id = "0";
  c.firstName = "Chris";
  c.surname = "Blogs";
  c.newPlan = mockPlan;

  const c1 = mock<Customer>();
  c1.id = "1";
  c1.firstName = "Joe";
  c1.surname = "Smith";
  c1.newPlan = mockPlan;

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(plannedMealsSelector as any)
    .mockReturnValue([
      [r, r1],
      [r2, r3],
    ]);

  when(mocked(useSelector))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .calledWith(customerSelectionsSelector as any)
    .mockReturnValue([
      {
        customer: c,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "EQ",
            },
            {
              recipe: r1,
              chosenVariant: "EQ",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "Mass",
            },
            {
              recipe: r3,
              chosenVariant: "Mass",
            },
          ],
        ],
      },

      {
        customer: c1,
        deliveries: [
          [
            {
              recipe: r,
              chosenVariant: "Mass",
            },
            {
              recipe: r1,
              chosenVariant: "Mass",
            },
          ],
          [
            {
              recipe: r2,
              chosenVariant: "EQ",
            },
            {
              recipe: r3,
              chosenVariant: "EQ",
            },
          ],
        ],
      },
    ]);

  render(
    <Grommet>
      <Finalize />
    </Grommet>
  );

  const customerTables = screen.getAllByRole("table");
  const bazSelect = within(customerTables[0]).getByDisplayValue("aa (EQ)");

  expect(bazSelect).toBeInTheDocument();
});

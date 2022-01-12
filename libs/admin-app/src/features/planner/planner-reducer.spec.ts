import plannerReducer, {
  generateCustomerMeals,
  adjustCustomerSelection,
  clearPlanner,
  addAdHoc,
} from "./planner-reducer"
import {resetAllWhenMocks, when} from "jest-when"
import AppState from "../../types/AppState"
import Customer from "../../domain/Customer"
import Recipe from "../../domain/Recipe"
import {
  chooseMeals,
  CustomerMealsSelection,
  SelectedMeal,
} from "../../meal-planning"
import {mock} from "jest-mock-extended"
import {mocked} from "ts-jest/utils"

jest.mock("../../meal-planning")

describe("The planner slice", () => {
  beforeEach(() => {
    resetAllWhenMocks()
  })

  it("Should start out with meals to select for each day set to empty arrays", () => {
    const initialState = mock<AppState>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(initialState.planner as any) = undefined

    const state = plannerReducer(initialState)

    expect(state.planner.selectedMeals).toHaveLength(3)
    expect(state.planner.selectedMeals[0]).toHaveLength(0)
    expect(state.planner.selectedMeals[1]).toHaveLength(0)
  })

  describe("adjustCustomerSelection", () => {
    it("should result in an individual customers selection being changed", () => {
      const mockRecipe = mock<Recipe>()
      mockRecipe.potentialExclusions = []
      mockRecipe.id = "recipe-0"
      const mockRecipe1 = mock<Recipe>()
      mockRecipe1.id = "recipe-1"
      mockRecipe1.potentialExclusions = []
      const mockRecipe2 = mock<Recipe>()
      mockRecipe2.id = "recipe-2"
      mockRecipe2.potentialExclusions = []
      const mockRecipe3 = mock<Recipe>()
      mockRecipe3.id = "recipe-3"
      mockRecipe3.potentialExclusions = []
      const mockRecipe4 = mock<Recipe>()
      mockRecipe4.id = "recipe-4"
      mockRecipe4.potentialExclusions = []
      const mockRecipe5 = mock<Recipe>()
      mockRecipe5.id = "recipe-5"
      mockRecipe5.potentialExclusions = []
      const initialState = mock<AppState>()
      initialState.planner.selectedMeals = [
        [mockRecipe, mockRecipe1, mockRecipe2],
        [mockRecipe3, mockRecipe4, mockRecipe5],
      ]
      const mockCustomer1 = mock<Customer>()
      mockCustomer1.exclusions = []
      mockCustomer1.id = "id-1"
      const mockCustomer2 = mock<Customer>()
      mockCustomer2.exclusions = []
      mockCustomer2.id = "id-2"

      initialState.planner.customerSelections = [
        {
          customer: mockCustomer1,
          deliveries: [
            [
              {recipe: mockRecipe1, chosenVariant: "EQ"},
              {recipe: mockRecipe2, chosenVariant: "EQ"},
              {recipe: mockRecipe3, chosenVariant: "EQ"},
            ],
          ],
        },

        {
          customer: mockCustomer2,
          deliveries: [
            [
              {recipe: mockRecipe5, chosenVariant: "EQ"},
              {recipe: mockRecipe2, chosenVariant: "EQ"},
            ],
          ],
        },
      ]

      const state = plannerReducer(
        initialState,
        adjustCustomerSelection({
          deliveryIndex: 0,
          index: 1,
          customer: mockCustomer2,
          recipe: mockRecipe3,
          variant: "EQ",
        })
      )
      expect(
        (
          (
            state.planner.customerSelections?.find(
              (selection) => selection.customer.id === mockCustomer2.id
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            )?.deliveries[0] as any
          )[1] as SelectedMeal
        ).recipe.id
      ).toEqual(mockRecipe3.id)
    })
  })

  describe("clearPlanner", () => {
    it("Should clear all planner state", () => {
      const mockRecipe = mock<Recipe>()
      mockRecipe.potentialExclusions = []
      mockRecipe.id = "recipe-0"
      const mockRecipe1 = mock<Recipe>()
      mockRecipe1.id = "recipe-1"
      mockRecipe1.potentialExclusions = []
      const mockRecipe2 = mock<Recipe>()
      mockRecipe2.id = "recipe-2"
      mockRecipe2.potentialExclusions = []
      const mockRecipe3 = mock<Recipe>()
      mockRecipe3.id = "recipe-3"
      mockRecipe3.potentialExclusions = []
      const mockRecipe4 = mock<Recipe>()
      mockRecipe4.id = "recipe-4"
      mockRecipe4.potentialExclusions = []
      const mockRecipe5 = mock<Recipe>()
      mockRecipe5.id = "recipe-5"
      mockRecipe5.potentialExclusions = []
      const initialState = mock<AppState>()
      initialState.planner.selectedMeals = [
        [mockRecipe, mockRecipe1, mockRecipe2],
        [mockRecipe3, mockRecipe4, mockRecipe5],
      ]
      const mockCustomer1 = mock<Customer>()
      mockCustomer1.exclusions = []
      mockCustomer1.id = "id-1"
      const mockCustomer2 = mock<Customer>()
      mockCustomer2.exclusions = []
      mockCustomer2.id = "id-2"

      initialState.planner.customerSelections = [
        {
          customer: mockCustomer1,
          deliveries: [
            [
              {recipe: mockRecipe1, chosenVariant: "EQ"},
              {recipe: mockRecipe2, chosenVariant: "EQ"},
              {recipe: mockRecipe3, chosenVariant: "EQ"},
            ],
          ],
        },

        {
          customer: mockCustomer2,
          deliveries: [
            [
              {recipe: mockRecipe5, chosenVariant: "EQ"},
              {recipe: mockRecipe2, chosenVariant: "EQ"},
            ],
          ],
        },
      ]
      const state = plannerReducer(initialState, clearPlanner())
      expect(state.planner.customerSelections).toBeUndefined()
      expect(state.planner.selectedMeals[0]).toHaveLength(0)
      expect(state.planner.selectedMeals[1]).toHaveLength(0)
    })
  })

  describe("Add adHoc", () => {
    it("Should add the next appropriate meal to the customer's selection", () => {
      const mockRecipe = mock<Recipe>()

      const mockRecipe1 = mock<Recipe>()
      const mockRecipe2 = mock<Recipe>()
      const mockRecipe3 = mock<Recipe>()
      const mockRecipe4 = mock<Recipe>()
      const mockRecipe5 = mock<Recipe>()

      const mockCustomer1 = mock<Customer>()
      mockCustomer1.id = "0"
      mockCustomer1.exclusions = []
      const mockCustomer2 = mock<Customer>()
      mockCustomer2.id = "1"
      mockCustomer2.exclusions = []

      const originalOutcome: CustomerMealsSelection = [
        {
          customer: mockCustomer1,
          deliveries: [
            [
              {recipe: mockRecipe, chosenVariant: "EQ"},
              {recipe: mockRecipe1, chosenVariant: "EQ"},
              {recipe: mockRecipe2, chosenVariant: "EQ"},
            ],
            [
              {recipe: mockRecipe3, chosenVariant: "EQ"},
              {recipe: mockRecipe4, chosenVariant: "EQ"},
              {recipe: mockRecipe5, chosenVariant: "EQ"},
            ],
          ],
        },

        {
          customer: mockCustomer2,
          deliveries: [
            [
              {recipe: mockRecipe, chosenVariant: "EQ"},
              {recipe: mockRecipe1, chosenVariant: "EQ"},
              {recipe: mockRecipe2, chosenVariant: "EQ"},
            ],
            [
              {recipe: mockRecipe3, chosenVariant: "EQ"},
              {recipe: mockRecipe4, chosenVariant: "EQ"},
              {recipe: mockRecipe5, chosenVariant: "Mass"},
            ],
          ],
        },
      ]

      const initialState = mock<AppState>()

      initialState.planner.selectedMeals = [
        [
          mockRecipe,
          mockRecipe1,
          mockRecipe2,
          mockRecipe3,
          mockRecipe4,
          mockRecipe5,
        ],
        [
          mockRecipe,
          mockRecipe1,
          mockRecipe2,
          mockRecipe3,
          mockRecipe4,
          mockRecipe5,
        ],
      ]
      initialState.planner.customerSelections = originalOutcome

      const state = plannerReducer(
        initialState,
        addAdHoc({customer: mockCustomer2, deliveryIndex: 1})
      )

      expect(state.planner.customerSelections?.[0].deliveries[0]).toHaveLength(
        3
      )
      expect(state.planner.customerSelections?.[0].deliveries[1]).toHaveLength(
        3
      )
      expect(state.planner.customerSelections?.[1].deliveries[0]).toHaveLength(
        3
      )
      expect(state.planner.customerSelections?.[1].deliveries[1]).toHaveLength(
        4
      )
      expect(
        Array.isArray(state.planner.customerSelections?.[1].deliveries[1]) &&
          state.planner.customerSelections?.[1].deliveries[1][3].chosenVariant
      ).toEqual("Mass")
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state.planner.customerSelections?.[1].deliveries[1] as any)[3].recipe
      ).toBe(mockRecipe3)
    })
  })

  describe("generateCustomerMeals", () => {
    it("Should change 'customerSelections' to the result of 'selectedMeals' being fed through 'planMeals'", () => {
      const mockRecipe = mock<Recipe>()

      const mockRecipe1 = mock<Recipe>()
      const mockRecipe2 = mock<Recipe>()
      const mockRecipe3 = mock<Recipe>()
      const mockRecipe4 = mock<Recipe>()
      const mockRecipe5 = mock<Recipe>()

      const mockCustomer1 = mock<Customer>()
      const mockCustomer2 = mock<Customer>()

      const initialState = mock<AppState>()

      const selectedMeals = [
        [mockRecipe, mockRecipe1, mockRecipe2],
        [mockRecipe3, mockRecipe4, mockRecipe5],
      ]

      initialState.customers.items = [mockCustomer1, mockCustomer2]

      const mockOutcome: CustomerMealsSelection = [
        {
          customer: mockCustomer1,
          deliveries: [
            [
              {recipe: mockRecipe, chosenVariant: "EQ"},
              {recipe: mockRecipe1, chosenVariant: "EQ"},
              {recipe: mockRecipe2, chosenVariant: "EQ"},
            ],
          ],
        },

        {
          customer: mockCustomer2,
          deliveries: [
            [
              {recipe: mockRecipe3, chosenVariant: "EQ"},
              {recipe: mockRecipe4, chosenVariant: "EQ"},
              {recipe: mockRecipe5, chosenVariant: "EQ"},
            ],
          ],
        },
      ]

      const dates = [new Date(Date.now()), new Date(Date.now())]

      when(mocked(chooseMeals, true))
        .calledWith(selectedMeals, dates, initialState.customers.items)
        .mockReturnValue(mockOutcome)

      const state = plannerReducer(
        initialState,
        generateCustomerMeals({
          deliveries: selectedMeals,
          deliveryDates: dates,
        })
      )

      expect(state.planner.customerSelections).toEqual(mockOutcome)
    })
  })
})

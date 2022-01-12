import { AnyAction, createAction } from "@reduxjs/toolkit";
import AppState from "../../types/AppState";
import Customer from "../../domain/Customer";
import DeliveryMealsSelection from "../../types/DeliveryMealsSelection";
import Recipe from "../../domain/Recipe";
import { defaultDeliveryDays, planLabels } from "../../lib/config";
import {
  chooseMeals,
  CustomerMealsSelection,
  SelectedMeal,
} from "../../meal-planning";

export interface PlannerState {
  selectedMeals: DeliveryMealsSelection[];
  customerSelections?: CustomerMealsSelection;
}

const initialState: PlannerState = {
  selectedMeals: defaultDeliveryDays.map(() => []),
};

interface GenerateSelectionPayload {
  deliveries: Recipe[][];
  deliveryDates: Date[];
}

interface RecipeRemovePayload {
  deliveryIndex: number;
  id: string;
}

interface CustomerSelectionAdjustPayload {
  index: number;
  deliveryIndex: number;
  customer: Customer;
  recipe: Recipe | undefined;
  variant: string;
}

const cloneDelivery = (delivery: Recipe[]) => [...delivery];

const executeAction = <T>(
  state: AppState,
  action: AnyAction | undefined,
  type: string,
  actionCallBack: (
    state: AppState,
    action: { type: string; payload: T }
  ) => AppState
): AppState => {
  const isActionType = (
    testedAction: AnyAction | undefined
  ): testedAction is { type: string; payload: T } =>
    testedAction?.type === type;

  if (isActionType(action)) {
    return actionCallBack(state, action);
  }
  return state;
};

interface AddAdHocPayload {
  customer: Customer;
  deliveryIndex: number;
}

export const clearPlanner = createAction("clearPlanner");
export const addAdHoc = createAction<AddAdHocPayload>("addAdHoc");
export const adjustCustomerSelection = createAction<
  CustomerSelectionAdjustPayload,
  "adjustCustomerSelection"
>("adjustCustomerSelection");
export const removeMeal = createAction<RecipeRemovePayload, "removeMeal">(
  "removeMeal"
);
export const generateCustomerMeals = createAction<GenerateSelectionPayload>(
  "generateCustomerMeals"
);

// eslint-disable-next-line sonarjs/cognitive-complexity
const plannerReducer = (state: AppState, action?: AnyAction): AppState => {
  const planner = state.planner;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!planner) {
    return {
      ...state,
      planner: initialState,
    };
  }

  const stateAfterRecipeRemove = executeAction<RecipeRemovePayload>(
    state,
    action,
    removeMeal.type,
    (newState, executingAction) => {
      const newSelections = newState.planner.selectedMeals.map(cloneDelivery);
      const found = newSelections[
        executingAction.payload.deliveryIndex
      ].findIndex((recipe) => {
        return recipe.id === executingAction.payload.id;
      });
      if (found > -1) {
        newSelections[executingAction.payload.deliveryIndex].splice(found, 1);
      }

      return {
        ...newState,
        planner: {
          ...newState.planner,
          selectedMeals: newSelections,
        },
      };
    }
  );

  const stateAfterMealGenerate = executeAction<GenerateSelectionPayload>(
    stateAfterRecipeRemove,
    action,
    generateCustomerMeals.type,
    (newState, executingAction) => ({
      ...newState,
      planner: {
        ...newState.planner,
        selectedMeals: executingAction.payload.deliveries.map(cloneDelivery),
        customerSelections: chooseMeals(
          executingAction.payload.deliveries,
          executingAction.payload.deliveryDates,
          newState.customers.items
        ),
      },
    })
  );

  const stateAfterClearAll = executeAction(
    stateAfterMealGenerate,
    action,
    clearPlanner.type,
    (newState) => ({
      ...newState,
      planner: {
        ...initialState,
      },
    })
  );

  const stateAfterAdhoc = executeAction<AddAdHocPayload>(
    stateAfterClearAll,
    action,
    addAdHoc.type,

    (newState, executingAction) => {
      if (!newState.planner.customerSelections) {
        return { ...newState };
      }

      return {
        ...newState,
        planner: {
          ...newState.planner,
          customerSelections: newState.planner.customerSelections.map(
            ({ customer, deliveries }) => ({
              customer: {
                ...customer,
                plan: { ...customer.plan },
                exclusions: customer.exclusions.map((exclusion) => ({
                  ...exclusion,
                })),
              },
              deliveries: deliveries.map((delivery, index) =>
                typeof delivery !== "string"
                  ? [
                      ...(index === executingAction.payload.deliveryIndex &&
                      customer.id === executingAction.payload.customer.id
                        ? [
                            ...delivery,
                            {
                              chosenVariant:
                                delivery.length === 0
                                  ? planLabels[0]
                                  : delivery[delivery.length - 1]
                                      ?.chosenVariant,
                              recipe:
                                newState.planner.selectedMeals[
                                  executingAction.payload.deliveryIndex
                                ][
                                  delivery.length %
                                    newState.planner.selectedMeals[
                                      executingAction.payload.deliveryIndex
                                    ].length
                                ],
                            },
                          ]
                        : delivery),
                    ]
                  : delivery
              ),
            })
          ),
        },
      };
    }
  );

  return executeAction<CustomerSelectionAdjustPayload>(
    stateAfterAdhoc,
    action,
    adjustCustomerSelection.type,
    (newState, executingAction) => {
      if (!newState.planner.customerSelections) {
        return { ...newState };
      }

      return {
        ...newState,
        planner: {
          ...newState.planner,
          customerSelections: newState.planner.customerSelections.map(
            ({ customer, deliveries }) => ({
              customer: {
                ...customer,
                plan: { ...customer.plan },
                exclusions: customer.exclusions.map((exclusion) => ({
                  ...exclusion,
                })),
              },
              deliveries: deliveries.map((delivery, index) =>
                typeof delivery !== "string"
                  ? [
                      ...(index === executingAction.payload.deliveryIndex
                        ? delivery.map((item, itemIndex) => ({
                            recipe:
                              itemIndex === executingAction.payload.index &&
                              customer.id ===
                                executingAction.payload.customer.id
                                ? executingAction.payload.recipe
                                : (item as SelectedMeal).recipe,

                            chosenVariant:
                              itemIndex === executingAction.payload.index &&
                              customer.id ===
                                executingAction.payload.customer.id
                                ? executingAction.payload.variant
                                : item.chosenVariant,
                          }))
                        : delivery),
                    ]
                  : delivery
              ),
            })
          ),
        },
      };
    }
  );
};

export const plannedMealsSelector = (
  state: AppState
): DeliveryMealsSelection[] => state.planner.selectedMeals;

export const customerSelectionsSelector = (
  state: AppState
): CustomerMealsSelection | undefined => state.planner.customerSelections;

export default plannerReducer;

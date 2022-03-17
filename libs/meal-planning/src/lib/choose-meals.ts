import {
  Customer,
  DeliveryMealsSelection,
  Recipe,
  CustomerPlan,
  CustomerWithNewPlan,
  CustomerMealsSelection,
  SelectedItem,
  Item,
} from '@tnmw/types';
import { extrasLabels, planLabels } from '@tnmw/config';
import getStatusString from './get-status-string';
import isActive from './is-active';

const isExcluded = (recipe: Recipe, customer: CustomerWithNewPlan) => {
  return recipe.invalidExclusions?.some((invalidExclusion) =>
    customer.exclusions
      .map((customerExclusion) => customerExclusion.id)
      .includes(invalidExclusion)
  );
};

const getRecipeFromSelection = (
  index: number,
  customer: CustomerWithNewPlan,
  deliverySelection: DeliveryMealsSelection
): Recipe => {
  const actualDeliverySelection = deliverySelection.filter(
    (recipe) => !isExcluded(recipe, customer)
  );

  const excluded = deliverySelection.length - actualDeliverySelection.length;

  const finalIndex = index % (deliverySelection.length - excluded);

  return excluded === 0
    ? deliverySelection[finalIndex]
    : actualDeliverySelection[finalIndex];
};

const generateDeliveryListFromItem = <
  T extends typeof extrasLabels[number] | typeof planLabels[number]
>(
  item: Item<T>
) =>
  [...Array.from({ length: item.quantity })].map(() => ({
    chosenVariant: item.name,
  }));

const generateDeliveries = (
  customer: CustomerWithNewPlan,
  plan: CustomerPlan,
  deliverySelections: DeliveryMealsSelection[],
  startPositions: number[]
) => {
  const newStartPositions = [...startPositions];
  return {
    startPositions: newStartPositions,
    deliveries: plan.deliveries.map(
      (delivery, deliveryIndex): SelectedItem[] => {
        const itemList = [
          ...delivery.items
            .flatMap((item) => generateDeliveryListFromItem(item))
            .map((item, index) => ({
              ...item,
              recipe: getRecipeFromSelection(
                index + startPositions[deliveryIndex],
                customer,
                deliverySelections[deliveryIndex]
              ),
            })),
          ...delivery.extras.flatMap((item) =>
            generateDeliveryListFromItem(item)
          ),
        ];
        newStartPositions[deliveryIndex] += itemList.length;
        return itemList;
      }
    ),
  };
};

const hasPlan = (
  customer: CustomerWithNewPlan
): customer is Omit<CustomerWithNewPlan, 'newPlan'> &
  Required<Pick<Customer, 'newPlan'>> => Boolean(customer.newPlan);

export const chooseMeals = (
  deliverySelection: DeliveryMealsSelection[],
  cookDates: Date[],
  customers: CustomerWithNewPlan[]
): CustomerMealsSelection =>
  customers
    .filter((customer) => hasPlan(customer))
    .map((customer) => ({
      customer,
      startPositions: deliverySelection.map(() => 0),
    }))
    .reduce<
      {
        customer: CustomerWithNewPlan;
        deliveries: SelectedItem[][];
        startPositions?: number[];
      }[]
    >((accum, customer, index) => {
      const deliveries = generateDeliveries(
        customer.customer,
        customer.customer.newPlan,
        deliverySelection,
        accum[index - 1]?.startPositions ?? customer.startPositions
      );
      return [
        ...accum,
        {
          ...customer,
          ...deliveries,
        },
      ];
    }, [])
    .map(({ customer, deliveries }) => ({
      customer,
      deliveries: deliveries.map((delivery, index) =>
        isActive(customer, cookDates[index])
          ? delivery
          : getStatusString(customer, cookDates[index])
      ),
    }));

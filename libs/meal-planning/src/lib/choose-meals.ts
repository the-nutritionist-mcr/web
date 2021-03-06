import {
  Customer,
  DeliveryMealsSelection,
  Recipe,
  CustomerPlan,
  SelectedItem,
  Item,
  CustomerWithChargebeePlan,
  CustomerMealsSelectionWithChargebeeCustomer,
} from '@tnmw/types';
import { extrasLabels, planLabels } from '@tnmw/config';

const isExcluded = (recipe: Recipe, customer: CustomerWithChargebeePlan) => {
  return recipe.invalidExclusions?.some((invalidExclusion) =>
    customer.exclusions
      .map((customerExclusion) => customerExclusion.id)
      .includes(invalidExclusion)
  );
};

const getRecipeFromSelection = (
  index: number,
  customer: CustomerWithChargebeePlan,
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
    isExtra: item.isExtra,
  }));

const generateDeliveries = (
  customer: CustomerWithChargebeePlan,
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
              recipe: !item.isExtra
                ? getRecipeFromSelection(
                    index + startPositions[deliveryIndex],
                    customer,
                    deliverySelections[deliveryIndex]
                  )
                : undefined,
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
  customer: CustomerWithChargebeePlan
): customer is Omit<CustomerWithChargebeePlan, 'newPlan'> &
  Required<Pick<Customer, 'newPlan'>> => Boolean(customer.newPlan);

export const chooseMeals = (
  deliverySelection: DeliveryMealsSelection[],
  cookDates: Date[],
  customers: CustomerWithChargebeePlan[]
): CustomerMealsSelectionWithChargebeeCustomer =>
  customers
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .filter(hasPlan)
    .map((customer) => ({
      customer,
      startPositions: deliverySelection.map(() => 0),
    }))
    .reduce<
      {
        customer: CustomerWithChargebeePlan;
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
    }, []);

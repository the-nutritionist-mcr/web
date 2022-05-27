import { ChangePlanRecipeBody, NewDelivery } from '@tnmw/types';

export const updateDelivery = (
  deliveries: NewDelivery[],
  data: ChangePlanRecipeBody
) => {
  if (data.itemIndex === undefined) {
    console.log('1');
    return deliveries.map((delivery, index) =>
      index !== data.deliveryIndex || typeof delivery === 'string'
        ? delivery
        : [
            ...delivery,
            {
              recipe: data.recipe,
              chosenVariant: data.chosenVariant,
            },
          ]
    );
  }

  if (data.chosenVariant) {
    console.log('2');
    return deliveries.map((delivery, index) =>
      index !== data.deliveryIndex || typeof delivery === 'string'
        ? delivery
        : delivery.map((item, itemIndex) =>
            itemIndex !== data.itemIndex
              ? item
              : {
                  recipe: data.recipe,
                  chosenVariant: data.chosenVariant,
                }
          )
    );
  }
  console.log('3');

  return deliveries.map((delivery, index) =>
    index !== data.deliveryIndex || typeof delivery === 'string' || data.recipe
      ? delivery
      : delivery.filter((item, index) => index !== data.itemIndex)
  );
};

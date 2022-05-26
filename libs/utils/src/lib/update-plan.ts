import { ChangePlanRecipeBody, NewDelivery } from '@tnmw/types';

export const updateDelivery = (
  deliveries: NewDelivery[],
  data: ChangePlanRecipeBody
) => {
  return deliveries
    .map((delivery, index) =>
      index !== data.deliveryIndex || typeof delivery === 'string'
        ? delivery
        : delivery.map((item, itemIndex) =>
            itemIndex !== data.itemIndex || !data.recipe
              ? item
              : {
                  recipe: data.recipe,
                  chosenVariant: data.chosenVariant,
                }
          )
    )
    .map((delivery, index) =>
      index !== data.deliveryIndex ||
      typeof delivery === 'string' ||
      data.recipe
        ? delivery
        : delivery.filter((item, index) => index !== data.deliveryIndex)
    )
    .map((delivery, index) =>
      index !== data.deliveryIndex ||
      typeof delivery === 'string' ||
      data.itemIndex !== undefined
        ? delivery
        : [
            ...delivery,
            {
              recipe: data.recipe,
              chosenVariant: data.chosenVariant,
            },
          ]
    );
};

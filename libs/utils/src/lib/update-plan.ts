import { ChangePlanRecipeBody, NewDelivery } from '@tnmw/types';

export const updateDelivery = (
  deliveries: NewDelivery[],
  data: ChangePlanRecipeBody
) => {
  const { recipe, chosenVariant, itemIndex, deliveryIndex } = data;
  if (itemIndex === undefined && recipe && chosenVariant) {
    return deliveries.map((delivery, index) =>
      index !== deliveryIndex || typeof delivery === 'string'
        ? delivery
        : [
            ...delivery,
            {
              recipe,
              chosenVariant,
            },
          ]
    );
  }

  if (chosenVariant) {
    return deliveries.map((delivery, index) =>
      index !== deliveryIndex || typeof delivery === 'string'
        ? delivery
        : delivery.map((item, itemIndex) =>
            itemIndex !== itemIndex || !chosenVariant
              ? item
              : {
                  recipe,
                  chosenVariant,
                }
          )
    );
  }

  return deliveries.map((delivery, index) =>
    index !== deliveryIndex || typeof delivery === 'string'
      ? delivery
      : delivery.filter((_item, index) => index !== itemIndex)
  );
};

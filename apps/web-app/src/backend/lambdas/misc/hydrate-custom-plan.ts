import { Delivery } from '@tnmw/types';

interface ItemFamily {
  name: string;
  isExtra: boolean;
}

export const hydrateCustomPlan = (
  customPlan: Delivery[] | undefined,
  itemFamilies: ItemFamily[]
): Delivery[] | undefined =>
  customPlan?.map?.((delivery) => ({
    ...delivery,
    items: delivery.items.map((item) => ({
      ...item,
      isExtra: itemFamilies?.find((family) => family.name === item.name)
        ?.isExtra,
    })),
  }));

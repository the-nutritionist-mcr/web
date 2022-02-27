import { CHARGEBEE } from '@tnmw/constants';
import { ChargeBee, _subscription } from 'chargebee-typescript';

interface Subscription {
  subscription_items?: SubscriptionItem[];
  customer_id: string;
}

interface SubscriptionItem {
  item_type: string;
  item_price_id: string;
}

export const getPlans = async (
  client: ChargeBee,
  subscription: Subscription
) => {
  const response = await client.subscription
    .list({
      customer_id: { is: subscription.customer_id },
      status: { is: CHARGEBEE.subscriptionStatuses.active },
    })
    .request();

  const { list } = response;

  const subscriptionPlans = await Promise.all(
    list.map(async (entry) => {
      const subscription = entry.subscription;

      const items = subscription.subscription_items.map(
        ({ item_type, item_price_id }) => ({
          item_type,
          item_price_id,
        })
      );

      const plans = await Promise.all(
        items
          .filter((item) => item.item_type === CHARGEBEE.itemTypes.plan)
          .map(async (item) => {
            const itemPriceResult = await client.item_price
              .retrieve(item.item_price_id)
              .request();

            const itemPrice = itemPriceResult.item_price;

            const itemResult = await client.item
              .retrieve(itemPrice.item_id)
              .request();

            const plan = itemResult.item;

            const daysPerWeek = Number(
              plan[CHARGEBEE.customFields.plan.daysPerWeek]
            );
            const itemsPerDay = Number(
              plan[CHARGEBEE.customFields.plan.itemsPerDay]
            );

            const itemFamilyResult = await client.item_family
              .retrieve(itemPrice.item_family_id)
              .request();

            const itemFamily = itemFamilyResult.item_family;

            const totalMeals = daysPerWeek * itemsPerDay;
            // eslint-disable-next-line unicorn/no-await-expression-member
            return {
              name: itemFamily.name,
              daysPerWeek,
              itemsPerDay,
              isExtra:
                itemFamily[CHARGEBEE.customFields.itemFamily.isExtra] === 'Yes',
              totalMeals,
            };
          })
      );

      return plans.filter(Boolean);
    })
  );

  return subscriptionPlans.flat();
};

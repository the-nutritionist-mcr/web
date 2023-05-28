import { CHARGEBEE } from '@tnmw/constants';
import { StandardPlan, SubscriptionStatus } from '@tnmw/types';
import { ChargeBee } from 'chargebee-typescript';

export const getPlans = async (
  client: ChargeBee,
  customerId: string
): Promise<StandardPlan[]> => {
  const response = await client.subscription
    .list({
      customer_id: { is: customerId },
      status: {
        in: [
          CHARGEBEE.subscriptionStatuses.active,
          CHARGEBEE.subscriptionStatuses.paused,
          CHARGEBEE.subscriptionStatuses.nonRenewing,
          CHARGEBEE.subscriptionStatuses.future,
        ],
      },
    })
    .request();

  const { list } = response;

  const subscriptionPlans = await Promise.all(
    list.map(async (entry) => {
      const subscription = entry.subscription;

      const items = subscription.subscription_items?.map(
        ({ item_type, item_price_id }) => ({
          item_type,
          item_price_id,
        })
      );

      const plans = items
        ? await Promise.all(
            items
              .filter((item) => item.item_type === CHARGEBEE.itemTypes.plan)
              .map(async (item) => {
                const itemPriceResult = await client.item_price
                  .retrieve(item.item_price_id)
                  .request();

                const itemPrice = itemPriceResult.item_price;

                const itemResult = await client.item
                  .retrieve(itemPrice.item_id ?? '')
                  .request();

                const plan = itemResult.item;

                const daysPerWeek = Number(
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  plan[CHARGEBEE.customFields.plan.daysPerWeek]
                );
                const itemsPerDay = Number(
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  plan[CHARGEBEE.customFields.plan.itemsPerDay]
                );

                const itemFamilyResult = await client.item_family
                  .retrieve(itemPrice.item_family_id ?? '')
                  .request();

                const itemFamily = itemFamilyResult.item_family;

                const pauseDate = subscription.pause_date;
                const pauseResume = subscription.resume_date;
                const startDate = subscription.start_date;
                const cancelledAt = subscription.cancelled_at;
                const termEnd = subscription.current_term_end;

                const totalMeals = daysPerWeek * itemsPerDay;
                // eslint-disable-next-line unicorn/no-await-expression-member
                return {
                  id: subscription.id,
                  name: itemFamily.name,
                  daysPerWeek,
                  itemsPerDay,
                  pauseStart: pauseDate && pauseDate * 1000,
                  startDate: startDate && startDate * 1000,
                  pauseEnd: pauseResume && pauseResume * 1000,
                  cancelledAt: cancelledAt && cancelledAt * 1000,
                  termEnd: termEnd && termEnd * 1000,
                  subscriptionStatus: subscription.status as SubscriptionStatus,
                  isExtra:
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    itemFamily[CHARGEBEE.customFields.itemFamily.isExtra] ===
                    'Yes',
                  totalMeals,
                };
              })
          )
        : [];

      return plans.filter(Boolean);
    })
  );

  return subscriptionPlans.flat();
};

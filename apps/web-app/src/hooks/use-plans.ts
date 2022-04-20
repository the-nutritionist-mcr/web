import { swrFetcher } from '../utils/swr-fetcher';
import {
  ChangePlanRecipeBody,
  CustomerMealsSelectionWithChargebeeCustomer,
  GetPlanResponse,
  NotYetPublishedResponse,
  StoredMealSelection,
} from '@tnmw/types';
import useMutation from 'use-mutation';
import { HTTP } from '@tnmw/constants';

import useSWR, { useSWRConfig } from 'swr';
export const usePlan = () => {
  const { mutate, cache } = useSWRConfig();

  const { data } = useSWR<GetPlanResponse | NotYetPublishedResponse>(
    'plan',
    swrFetcher
  );

  const publishPlan = async (): Promise<void> =>
    await swrFetcher('plan/publish', {
      method: HTTP.verbs.Post,
      body: JSON.stringify({
        id: 'plan',
        sort: data.available && data.date,
      }),
    });

  const [publish] = useMutation<void>(publishPlan, {
    onMutate() {
      const data: GetPlanResponse = cache.get('plan');
      const newData = {
        ...data,
        published: true,
      };
      mutate('plan', newData, false);
      return () => {
        mutate('plan', data, false);
      };
    },
  });

  const changePlanItem = async (newItem: ChangePlanRecipeBody): Promise<void> =>
    await swrFetcher('plan', {
      method: HTTP.verbs.Put,
      body: JSON.stringify(newItem),
    });

  const [update] = useMutation(changePlanItem, {
    onMutate({ input }) {
      const data: GetPlanResponse = cache.get('plan');
      const newData = {
        ...data,
        selections: data.selections.map(
          (
            dataRow: CustomerMealsSelectionWithChargebeeCustomer[number] & {
              id: StoredMealSelection['id'];
              sort: StoredMealSelection['sort'];
            }
          ) =>
            dataRow.id !== input.selectionId ||
            dataRow.sort !== input.selectionSort
              ? dataRow
              : {
                  ...dataRow,
                  deliveries: dataRow.deliveries.map(
                    (delivery, deliveryIndex) =>
                      input.deliveryIndex !== deliveryIndex ||
                      typeof delivery === 'string'
                        ? delivery
                        : delivery.map((item, itemIndex) =>
                            itemIndex !== input.itemIndex
                              ? item
                              : {
                                  recipe: input.recipe,
                                  chosenVariant: input.chosenVariant,
                                }
                          )
                  ),
                }
        ),
      };

      mutate('plan', newData, false);
      return () => {
        mutate('plan', data, false);
      };
    },
  });

  return { data, update, publish };
};

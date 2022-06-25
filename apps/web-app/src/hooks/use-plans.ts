import { swrFetcher } from '../utils/swr-fetcher';
import {
  ChangePlanRecipeBody,
  CustomerMealsSelectionWithChargebeeCustomer,
  GetPlanResponse,
  NotYetPublishedResponse,
  StoredMealSelection,
  SubmitCustomerOrderPayload,
} from '@tnmw/types';
import useMutation from 'use-mutation';
import { HTTP } from '@tnmw/constants';

import useSWR, { useSWRConfig } from 'swr';
import { updateDelivery } from '@tnmw/utils';
import toast from 'react-hot-toast';
export const usePlan = () => {
  const { mutate, cache } = useSWRConfig();

  const { data } = useSWR<GetPlanResponse | NotYetPublishedResponse>(
    'plan',
    swrFetcher
  );

  const submitOrder = async (
    details: SubmitCustomerOrderPayload
  ): Promise<void> =>
    await swrFetcher('plan/submit-order', {
      method: HTTP.verbs.Post,
      body: JSON.stringify(details),
    });

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
                  deliveries: updateDelivery(dataRow.deliveries, input),
                }
        ),
      };

      mutate('plan', newData, false);
      return () => {
        mutate('plan', data, false);
      };
    },

    onFailure() {
      toast.error('Failed to update plan');
    },

    onSuccess() {
      toast.success('Plan successfully updated');
    },
  });

  const finalData = data?.available
    ? { ...data, date: new Date(Number(data.date)) }
    : data;

  return { data: finalData, update, publish, submitOrder };
};

import { swrFetcher } from '../utils/swr-fetcher';
import {
  ChangePlanRecipeBody,
  CustomerMealsSelectionWithChargebeeCustomer,
  GetPlanResponseAdmin,
  GetPlanResponseNonAdmin,
  NotYetPublishedResponse,
  StoredMealSelection,
  SubmitCustomerOrderPayload,
} from '@tnmw/types';
import useMutation from 'use-mutation';
import { HTTP } from '@tnmw/constants';

import useSWR, { useSWRConfig } from 'swr';
import {
  recursivelyDeserialiseDate,
  SerialisedDate,
  updateDelivery,
} from '@tnmw/utils';
import toast from 'react-hot-toast';
import { LoadingContext } from '@tnmw/components';
import { useContext } from 'react';

const LOADING_KEY = 'plan-data';

export const usePlan = () => {
  const { mutate, cache } = useSWRConfig();

  const { data: serialisedData } = useSWR<
    SerialisedDate<
      GetPlanResponseNonAdmin | GetPlanResponseAdmin | NotYetPublishedResponse
    >
  >('plan', swrFetcher, {
    fallback: {
      plan: { available: false, admin: false },
    },
  });

  const data = recursivelyDeserialiseDate(serialisedData);

  const submitOrder = async (
    details: SubmitCustomerOrderPayload
  ): Promise<void> => {
    return await swrFetcher('plan/submit-order', {
      method: HTTP.verbs.Post,
      body: JSON.stringify(details),
    });
  };

  const publishPlan = async (): Promise<void> => {
    console.log('called publishPlan');
    try {
      const args = {
        method: HTTP.verbs.Post,
        body: JSON.stringify({
          id: 'plan',
          sort: data.available && data.sort,
        }),
      };
      console.log(args);
      await swrFetcher('plan/publish', args);
    } catch (error) {
      console.log(error);
    }
  };

  const [publish] = useMutation<void>(publishPlan, {
    onMutate() {
      console.log('start mutate');
      const data: GetPlanResponseAdmin = cache.get('plan');
      const newData = {
        ...data,
        published: true,
      };
      mutate('plan', newData, false);
      console.log('finish mutate');
      return () => {
        console.log('rollback');
        mutate('plan', data, false);
        console.log('finish rollback');
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
      // const data: GetPlanResponseAdmin = cache.get('plan');
      // const newData = {
      //   ...data,
      //   selections: data.selections.map(
      //     (
      //       dataRow: CustomerMealsSelectionWithChargebeeCustomer[number] & {
      //         id: StoredMealSelection['id'];
      //         sort: StoredMealSelection['sort'];
      //       }
      //     ) =>
      //       dataRow.id !== input.selectionId ||
      //       dataRow.sort !== input.selectionSort
      //         ? dataRow
      //         : {
      //             ...dataRow,
      //             deliveries: updateDelivery(dataRow.deliveries, input),
      //           }
      //   ),
      // };
      // mutate('plan', newData, false);
      // return () => {
      //   mutate('plan', data, false);
      // };
    },

    onFailure() {
      toast.error('Failed to update plan');
    },

    onSuccess() {
      toast.success('Plan successfully updated');
    },
  });

  if (!data) {
    return { data: undefined, update, publish, submitOrder };
  }

  if (data.available === true) {
    return {
      data: { ...data, date: new Date(Number(data.plan.createdOn)) },
      update,
      publish: async () => {
        console.log('DEFINITELY called');
        await publish();
        console.log('finished publish');
      },
      submitOrder,
    };
  }

  const { startLoading, stopLoading, isLoading } = useContext(LoadingContext);

  if (!data) {
    startLoading(LOADING_KEY);
  }

  if (data && isLoading) {
    stopLoading(LOADING_KEY);
  }

  return {
    data: recursivelyDeserialiseDate(data),
    update,
    publish,
    submitOrder,
  };
};

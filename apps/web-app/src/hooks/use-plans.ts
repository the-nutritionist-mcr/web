import { swrFetcher } from '../utils/swr-fetcher';
import {
  GetPlanResponseAdmin,
  GetPlanResponseNonAdmin,
  NotYetPublishedResponse,
  SubmitCustomerOrderPayload,
  MealSelectionPayload,
  MealPlanGeneratedForIndividualCustomer,
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

type GetPlanResponse =
  | GetPlanResponseAdmin
  | GetPlanResponseNonAdmin
  | NotYetPublishedResponse;

export const usePlan = () => {
  const { mutate, cache } = useSWRConfig();
  const { startLoading, stopLoading, isLoading } = useContext(LoadingContext);

  const { data: serialisedData } = useSWR<SerialisedDate<GetPlanResponse>>(
    'plan',
    swrFetcher,
    {
      fallback: {
        plan: { available: false, admin: false },
      },
    }
  );

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
      const data: GetPlanResponseAdmin = cache.get('plan');
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

  const changePlanItem = async (
    newItem: MealPlanGeneratedForIndividualCustomer
  ): Promise<void> =>
    await swrFetcher('customer/update-plan', {
      method: HTTP.verbs.Put,
      body: JSON.stringify({
        id: serialisedData.available && serialisedData.planId,
        selection: newItem,
      }),
    });

  const [update] = useMutation(changePlanItem, {
    onMutate({ input }) {
      const data: GetPlanResponse = cache.get('plan');

      if (data.available && data.admin) {
        const newData: GetPlanResponseAdmin = {
          ...data,
          plan: {
            ...data.plan,
            customerPlans: data.plan.customerPlans.map((plan) =>
              plan.customer.username === input.customer.username ? input : plan
            ),
          },
        };
        mutate('plan', newData, false);
      }

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

  if (!data) {
    return { data: undefined, update, publish, submitOrder };
  }

  if (data.available === true) {
    return {
      data: { ...data, date: new Date(Number(data.plan.createdOn)) },
      update,
      publish: async () => {
        await publish();
      },
      submitOrder,
    };
  }

  if (!data) {
    startLoading(LOADING_KEY);
  }

  if (data && isLoading) {
    stopLoading(LOADING_KEY);
  }

  return {
    data,
    update,
    publish,
    submitOrder,
  };
};

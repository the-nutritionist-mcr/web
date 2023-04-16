import { swrFetcher } from '../utils/swr-fetcher';
import {
  GetPlanResponseAdmin,
  GetPlanResponseNonAdmin,
  NotYetPublishedResponse,
  MealPlanGeneratedForIndividualCustomer,
} from '@tnmw/types';
import useMutation from 'use-mutation';
import { HTTP } from '@tnmw/constants';

import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { useSwrWrapper } from './use-swr-wrapper';

type GetPlanResponse =
  | GetPlanResponseAdmin
  | GetPlanResponseNonAdmin
  | NotYetPublishedResponse;

export const usePlan = () => {
  const { mutate, cache } = useSWRConfig();

  const { data } = useSwrWrapper<GetPlanResponse>('plan', {
    revalidateIfStale: true,
  });

  const publishPlan = async (): Promise<void> => {
    try {
      const args = {
        method: HTTP.verbs.Post,
        body: JSON.stringify({
          id: 'plan',
          sort: data?.available && data.sort,
        }),
      };
      await swrFetcher('plan/publish', args);
      toast.success('Plan successfully published!');
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
        id: data?.available && data.planId,
        selection: newItem,
      }),
    });

  const [update] = useMutation(changePlanItem, {
    onMutate({ input }) {
      const data: GetPlanResponse = cache.get('plan');

      const { available, admin } = data;

      if (available && admin) {
        const { plan } = data;
        const existing = plan?.customerPlans.find(
          (plan) => plan.customer.username === input.customer.username
        );
        const newData: GetPlanResponseAdmin = {
          ...data,
          plan: {
            ...plan,
            customerPlans: existing
              ? plan?.customerPlans.map((plan) =>
                  plan.customer.username === input.customer.username
                    ? input
                    : plan
                )
              : [...(plan?.customerPlans ?? []), input],
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
      console.log('success');
      toast.success('Plan successfully updated');
    },
  });

  if (!data) {
    return { data: undefined, update, publish };
  }

  if (data.available === true) {
    return {
      data: { ...data, date: new Date(Number(data.plan.createdOn)) },
      update,
      publish: async () => {
        await publish();
      },
    };
  }

  return {
    data,
    update,
  };
};

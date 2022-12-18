import toast from 'react-hot-toast';
import { HTTP } from '@tnmw/constants';
import { BackendCustomer, UpdateCustomerBody } from '@tnmw/types';
import { useSWRConfig } from 'swr';
import useMutation from 'use-mutation';
import { swrFetcher } from '../utils/swr-fetcher';
import { useSwrWrapper } from './use-swr-wrapper';

// eslint-disable-next-line fp/no-let
let originalData: BackendCustomer | undefined;

export const useCustomer = (username: string | undefined) => {
  const key = `customer/${username}`;
  const { mutate, cache } = useSWRConfig();
  const { data } = useSwrWrapper<BackendCustomer>(
    username && `customer/${username}`
  );

  const updateCustomer = async (input: UpdateCustomerBody): Promise<void> => {
    await swrFetcher(key, {
      method: HTTP.verbs.Post,
      body: JSON.stringify(input),
    });
  };

  const update = (input: UpdateCustomerBody) => {
    const data = cache.get(key) as BackendCustomer;
    if (!originalData) {
      originalData = data;
    }

    const newCustomer: BackendCustomer = {
      ...data,
      customPlan: input.customPlan,
      customisations: input.customisations,
    };
    mutate(key, newCustomer, false);
  };

  const [save] = useMutation(updateCustomer, {
    onSettled({ input, status }) {
      const data = cache.get(key) as BackendCustomer;

      const newCustomer: BackendCustomer = {
        ...data,
        customPlan: input.customPlan,
        customisations: input.customisations,
      };

      switch (status) {
        case 'success':
          toast.success(`Customer record saved successfully`);
          mutate(key, newCustomer, false);
          break;
        case 'failure':
          mutate(key, originalData, false);
          originalData = undefined;
          break;
      }
    },

    onFailure(error) {
      console.log(error);
      toast.error(`failed to update customer record`);
    },
  });

  const dirty = Boolean(originalData);

  return { data, save, update, dirty };
};

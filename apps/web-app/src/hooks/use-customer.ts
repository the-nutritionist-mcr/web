import { Update } from '@aws-sdk/client-dynamodb';
import { HTTP } from '@tnmw/constants';
import { BackendCustomer, UpdateCustomerBody } from '@tnmw/types';
import useSWR, { useSWRConfig } from 'swr';
import useMutation from 'use-mutation';
import { swrFetcher } from '../utils/swr-fetcher';

// eslint-disable-next-line fp/no-let
let originalData: UpdateCustomerBody | undefined;

export const useCustomer = (username: string) => {
  const key = `customer/${username}`;
  const { mutate, cache } = useSWRConfig();
  const { data } = useSWR<BackendCustomer>(`customer/${username}`, swrFetcher);

  const updateCustomer = async (input: UpdateCustomerBody): Promise<void> => {
    await swrFetcher(key, {
      method: HTTP.verbs.Post,
      body: JSON.stringify(input),
    });
  };

  const update = (input: UpdateCustomerBody) => {
    const data = cache.get(key);
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
      const data = cache.get(key);

      const newCustomer: BackendCustomer = {
        ...data,
        customPlan: input.customPlan,
        customisations: input.customisations,
      };

      switch (status) {
        case 'success':
          mutate(key, newCustomer, false);
          break;
        case 'failure':
          mutate(key, originalData, false);
          originalData = undefined;
          break;
      }
    },
  });

  const dirty = Boolean(originalData);

  return { data, save, update, dirty };
};

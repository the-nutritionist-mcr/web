import { HTTP } from '@tnmw/constants';
import { BackendCustomer, UpdateCustomerBody } from '@tnmw/types';
import useSWR, { useSWRConfig } from 'swr';
import useMutation from 'use-mutation';
import { swrFetcher } from '../utils/swr-fetcher';

export const useCustomer = (username: string) => {
  const key = `customer/${username}`;
  const { mutate, cache } = useSWRConfig();

  const updateCustomer = async (input: UpdateCustomerBody): Promise<void> => {
    console.log(JSON.stringify(input));
    await swrFetcher(key, {
      method: HTTP.verbs.Post,
      body: JSON.stringify(input),
    });
  };

  const [update] = useMutation(updateCustomer, {
    onSettled({ input, status }) {
      console.log(status);
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
          mutate(key, data, false);
          break;
      }
    },
  });

  const { data } = useSWR<BackendCustomer>(`customer/${username}`, swrFetcher);

  return { data, update };
};

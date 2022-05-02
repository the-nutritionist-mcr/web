import { CustomerWithChargebeePlan } from '@tnmw/types';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

export const useCustomer = (username: string) => {
  const { data } = useSWR<CustomerWithChargebeePlan>(
    `customer/${username}`,
    swrFetcher
  );

  return { data };
};

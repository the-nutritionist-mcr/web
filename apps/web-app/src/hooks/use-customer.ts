import { CustomerWithChargebeePlan } from '@tnmw/types';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

export const useCustomer = (id: string) => {
  const { data } = useSWR<CustomerWithChargebeePlan>(
    `customer/${id}`,
    swrFetcher
  );

  return { data };
};

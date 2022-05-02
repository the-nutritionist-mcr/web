import { CustomerWithChargebeePlan } from '@tnmw/types';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

export const useCustomer = () => {
  const { data } = useSWR<CustomerWithChargebeePlan>('customer', swrFetcher);

  return { data };
};

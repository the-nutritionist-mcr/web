import { CustomerWithChargebeePlan } from '@tnmw/types';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';
import { useSwrWrapper } from './use-swr-wrapper';

interface CustomersResponse {
  users: CustomerWithChargebeePlan[];
}

export const useCustomers = () => {
  const { data: getData } = useSwrWrapper<CustomersResponse>(
    'customers',
    swrFetcher,
    {}
  );

  return { items: getData?.users };
};

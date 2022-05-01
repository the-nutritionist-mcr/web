import { CustomerWithChargebeePlan } from '@tnmw/types';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

interface CustomersResponse {
  users: CustomerWithChargebeePlan[];
}

export const useCustomers = () => {
  const { data: getData } = useSWR<CustomersResponse>('customers', swrFetcher);

  return { items: getData?.users };
};

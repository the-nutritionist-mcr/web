import { BackendCustomer } from '@tnmw/types';
import { useSwrWrapper } from './use-swr-wrapper';

interface CustomersResponse {
  users: (BackendCustomer & { id: string })[];
}

export const useCustomers = () => {
  const { data: getData } = useSwrWrapper<CustomersResponse>('customers');

  return { items: getData?.users };
};

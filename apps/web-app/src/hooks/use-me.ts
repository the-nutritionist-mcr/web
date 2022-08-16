import { BackendCustomer } from '@tnmw/types';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

export const useMe = () => {
  const { data } = useSWR<BackendCustomer & { id: string }>(
    'customers/me',
    swrFetcher
  );
  console.log(data);

  return data;
};

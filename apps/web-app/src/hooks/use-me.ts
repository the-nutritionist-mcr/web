import { BackendCustomer } from '@tnmw/types';
import { swrFetcher } from '../utils/swr-fetcher';
import { useSwrWrapper } from './use-swr-wrapper';

export const useMe = () => {
  const { data } = useSwrWrapper<BackendCustomer & { id: string }>(
    'customers/me'
  );

  return data;
};

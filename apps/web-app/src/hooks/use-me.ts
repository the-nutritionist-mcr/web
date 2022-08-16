import { LoadingContext } from '@tnmw/components';
import { BackendCustomer } from '@tnmw/types';
import { useContext } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

const LOADING_KEY = 'account-data';

export const useMe = () => {
  const { startLoading, stopLoading, isLoading } = useContext(LoadingContext);
  const { data } = useSWR<BackendCustomer & { id: string }>(
    'customers/me',
    swrFetcher
  );

  if (!data) {
    startLoading(LOADING_KEY);
  }

  if (data && isLoading) {
    stopLoading(LOADING_KEY);
  }

  console.log(data);

  return data;
};

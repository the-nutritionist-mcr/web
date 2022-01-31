import useSWR from 'swr';
import { Exclusion } from '@tnmw/admin-app';
import { swrFetcher } from '../utils/swr-fetcher';

interface Response {
  items: Exclusion[];
}

export const useCustomisations = () => {
  return useSWR<Response>('customisation', swrFetcher);
};

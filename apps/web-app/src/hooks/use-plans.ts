import { swrFetcher } from '../utils/swr-fetcher';
import { GetPlanResponse } from '@tnmw/types';

import useSWR from 'swr';

export const usePlan = () => {
  const { data } = useSWR<GetPlanResponse>('plan', swrFetcher);

  return { data };
};

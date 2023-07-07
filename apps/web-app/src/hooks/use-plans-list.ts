import { useSwrWrapper } from './use-swr-wrapper';

export interface PlanId {
  sort: string;
  createdOn: Date;
}

export const usePlansList = () => {
  const { data } = useSwrWrapper<PlanId[]>('plan/list');

  return { data };
};

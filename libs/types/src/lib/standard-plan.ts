export type SubscriptionStatus =
  | 'future'
  | 'in_trial'
  | 'active'
  | 'non_renewing'
  | 'paused'
  | 'cancelled';

export interface StandardPlan {
  id: string;
  name: string;
  daysPerWeek: number;
  itemsPerDay: number;
  isExtra: boolean;
  totalMeals: number;
  pauseStart?: number;
  pauseEnd?: number;
  subscriptionStatus: SubscriptionStatus;
  startDate?: number;
  termEnd?: number;
  cancelledAt?: number;
}

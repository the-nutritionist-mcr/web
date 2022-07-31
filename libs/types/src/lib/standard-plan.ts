export type SubscriptionStatus =
  | 'future'
  | 'in_trial'
  | 'active'
  | 'non_renewing'
  | 'paused'
  | 'cancelled';

export interface StandardPlan {
  name: string;
  daysPerWeek: number;
  itemsPerDay: number;
  isExtra: boolean;
  totalMeals: number;
  pauseStart?: number;
  pauseEnd?: number;
  subscriptionStatus: SubscriptionStatus;
  startDate?: number;
}

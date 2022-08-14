import { Delivery, StandardPlan } from '@tnmw/types';
import { Cook } from './choose-meals-v2';

export const generateDistribution = (
  cook: Cook,
  allCooks: Cook[],
  plan: StandardPlan,
  customPlan?: Delivery[]
): DeliveryItem[] => {};

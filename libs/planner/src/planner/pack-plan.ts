import { CustomerDelivery } from '../entities';

export interface PackPlan {
  deliveries: ReadonlyArray<CustomerDelivery>;
}

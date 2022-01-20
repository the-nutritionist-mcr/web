import { CustomerDelivery } from "./customer-delivery";

export interface CustomerMealPlan {
  readonly deliveries: ReadonlyArray<CustomerDelivery>;
}

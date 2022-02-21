export interface ChargebeePlan {
  name: string;
  daysPerWeek: number;
  itemsPerDay: number;
  totalMeals: number;
  isExtra: boolean;
}

export interface ChargebeeCustomer {
  deliveryDay1: string;
  deliveryDay2: string;
  deliveryDay3: string;
  profileNotes: string;
  plans: ChargebeePlan[];
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  city: string;
  postcode: string;
}

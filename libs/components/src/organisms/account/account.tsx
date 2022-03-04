import { FC } from 'react';

interface StandardPlan {
  name: string;
  daysPerWeek: number;
  itemsPerDay: number;
  isExtra: false;
  totalMeals: number;
}

export interface User {
  username: string;
  country: string;
  deliveryDay1: string;
  deliveryDay2: string;
  deliveryDay3: string;
  customerUpdateTime: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  addressLine3: string;
  subscriptionUpdateTime: string;
  firstName: string;
  surname: string;
  email: string;
  city: string;
  postcode: string;
  plans: StandardPlan[];
}

interface AccountProps {
  userDetails: User;
}

export const Account: FC<AccountProps> = ({ userDetails }) => (
  <>
    <h2>User Details</h2>
    <ul>
      <li>First Name: {userDetails.firstName}</li>
      <li>Last Name: {userDetails.surname}</li>
      <li>Email: {userDetails.email}</li>
      <li>Address Line 1: {userDetails.addressLine1}</li>
      <li>Address Line 2: {userDetails.addressLine2}</li>
      <li>Address Line 3: {userDetails.addressLine3}</li>
      <li>Postcode: {userDetails.postcode}</li>
      <li>City: {userDetails.city}</li>
      <li>Country: {userDetails.country}</li>
    </ul>

    <h2>User Plans</h2>
    <ul>
      {userDetails.plans.map((plan) => (
        <li>
          {plan.name} {plan.itemsPerDay}, {plan.daysPerWeek} days
        </li>
      ))}
    </ul>
  </>
);

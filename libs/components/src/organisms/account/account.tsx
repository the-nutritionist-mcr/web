import { FC } from "react";

interface UserDetails {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  country: string
}

interface AccountProps {
  userDetails: UserDetails
}

export const Account: FC<AccountProps> = ({ userDetails }) => 
  <ul>
    <li>First Name: {userDetails.firstName}</li>
    <li>Last Name: {userDetails.lastName}</li>
    <li>Email: {userDetails.email}</li>
    <li>Address Line 1: {userDetails.addressLine1}</li>
    <li>Address Line 2: {userDetails.addressLine2}</li>
    <li>Address Line 3: {userDetails.addressLine3}</li>
    <li>City: {userDetails.city}</li>
    <li>Country: {userDetails.country}</li>
  </ul>


import { FC, useEffect, useState } from 'react';
import { Hero, Layout, Button, Account } from '@tnmw/components';
import Router from 'next/router';
import {DYNAMO} from "@tnmw/constants"
import { currentUser, signOut } from '../aws/authenticate';
import { Hub } from 'aws-amplify';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import { authorizedRoute } from '../utils/authorised-route';

const YourAccountHeaderBox = styled('div')`
  text-align: center;
  color: #3b7d7a;
  align-items: center;
  flex-direction: row;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const YourAccountHeader = styled('h1')`
  font-size: 40px;
  display: auto;
  margin: 0.5rem 0 0 0;
`;
const user = currentUser()
console.log(user)

interface Me {
  first_name: string;
  last_name: string;
  email: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  city: string;
  country: string;
  phone: string;
  postcode: string;
}

const AccountPage: FC = () => {
  const [me, setMe] = useState<Me | undefined>()

  useEffect(() => {
    (async () => {
      const user = await currentUser()
      setMe({
        first_name: user.attributes[DYNAMO.standardAttributes.firstName],
        last_name: user.attributes[DYNAMO.standardAttributes.surname],
        email: user.attributes[DYNAMO.standardAttributes.email],
        address_line1: user.attributes[DYNAMO.customAttributes.AddressLine1],
        address_line2: user.attributes[DYNAMO.customAttributes.AddressLine2],
        address_line3: user.attributes[DYNAMO.customAttributes.AddressLine3],
        city: user.attributes[DYNAMO.customAttributes.City],
        country: user.attributes[DYNAMO.customAttributes.Country],
        phone: user.attributes[DYNAMO.standardAttributes.phone],
        postcode: user.attributes[DYNAMO.customAttributes.Postcode],
      });

    Hub.listen('auth', (data) => {
      if(data.payload.event === "signOut") {
        setMe(undefined)
      }
    })
    })()
});


  return (
    <>
      <Hero>
        <YourAccountHeaderBox>
          <img
            src={AccountIcon as unknown as string}
            alt=""
            height="80"
            width="80"
          />
          <YourAccountHeader>Your Account</YourAccountHeader>
        </YourAccountHeaderBox>
      </Hero>
      <h2>You are logged in</h2>
      {me && (
        <Account
          userDetails={{
            firstName: me.first_name,
            lastName: me.last_name,
            email: me.email,
            contactNumber: me.phone,
            addressLine1: me.address_line1,
            addressLine2: me.address_line2,
            addressLine3: me.address_line3,
            city: me.city,
            country: me.country,
            postcode: me.postcode,
          }}
        />
      )}
      <Button
        onClick={async () => {
          await signOut();
          // eslint-disable-next-line fp/no-mutating-methods
          await Router.push('/');
        }}
      >
        Logout
      </Button>
    </>
  );
};

export const getServerSideProps = authorizedRoute();

export default AccountPage;

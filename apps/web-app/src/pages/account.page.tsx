import { FC, useEffect, useState } from 'react';
import { Hero, Layout, Button, Account } from '@tnmw/components';
import Router from 'next/router';
import {DYNAMO} from "@tnmw/constants"
import { currentUser, signOut } from '../aws/authenticate';
import { Hub } from 'aws-amplify';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import { authorizedRoute, AuthorizedRouteProps } from '../utils/authorised-route';

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

const AccountPage: FC<AuthorizedRouteProps> = ({ user }) => {

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
      <Account
        userDetails={user}
      />
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

import { FC } from 'react';
import { Hero, Layout, Button } from '@tnmw/components';
import Router from 'next/router';
import { signOut } from '../aws/authenticate';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import { authorizedRoute } from '../utils/authorised-route';
import { useMe } from '../hooks/use-me';

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

const Account: FC = () => {
  const me = useMe();
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
        <ul>
          <li>First Name: {me.first_name}</li>
          <li>Last Name: {me.last_name}</li>
          <li>Email: {me.email}</li>
          <li>Address Line 1: {me.address_line1}</li>
          <li>Address Line 2: {me.address_line2}</li>
          <li>Address Line 3: {me.address_line3}</li>
          <li>City: {me.city}</li>
          <li>Country: {me.country}</li>
        </ul>
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

export default Account;

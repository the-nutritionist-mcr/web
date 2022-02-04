import { FC } from 'react';
import { Hero, Layout, Button, Account } from '@tnmw/components';
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

const AccountPage: FC = () => {
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
            country: me.country
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

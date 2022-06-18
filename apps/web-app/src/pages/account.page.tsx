import { FC } from 'react';
import { Hero, Button, Account } from '@tnmw/components';
import Router from 'next/router';
import { currentUser, signOut } from '../aws/authenticate';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import {
  authorizedRoute,
  AuthorizedRouteProps,
} from '../utils/authorised-route';

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

const logout = async () => {
  await signOut();
  // eslint-disable-next-line fp/no-mutating-methods
  await Router.push('/');
};

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
      <Account userDetails={user} showChooseButton={true} logout={logout} />
    </>
  );
};

export const getServerSideProps = authorizedRoute();

export default AccountPage;

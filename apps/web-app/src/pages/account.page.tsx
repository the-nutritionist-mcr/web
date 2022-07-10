import { FC, useContext } from 'react';
import { getClosingDate } from '../utils/get-closing-date';
import { UserContext, Hero, Account } from '@tnmw/components';
import Router from 'next/router';
import { signOut } from '../aws/authenticate';
import { PageSpacing } from './page-spacing';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import {
  authorizedRoute,
  AuthorizedRouteProps,
} from '../utils/authorised-route';

import { usePlan } from '../hooks';

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

const AccountPage: FC<AuthorizedRouteProps> = ({ user }) => {
  const { setUser } = useContext(UserContext);
  const { data } = usePlan();

  const now = new Date(Date.now());

  const showChooseButton =
    data &&
    (data?.available || now < getClosingDate(new Date(Number(data?.date))));

  const logout = async () => {
    await signOut();
    // eslint-disable-next-line fp/no-mutating-methods
    await Router.push('/');
    setUser(undefined);
  };

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
      <PageSpacing>
        <Account
          userDetails={user}
          showChooseButton={showChooseButton}
          logout={logout}
        />
      </PageSpacing>
    </>
  );
};

export const getServerSideProps = authorizedRoute();

export default AccountPage;

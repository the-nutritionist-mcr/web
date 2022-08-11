import { FC, useContext } from 'react';
import { getClosingDate } from '../utils/get-closing-date';
import {
  UserContext,
  Hero,
  Account,
  ParagraphText,
  Heading,
} from '@tnmw/components';
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
import { getClosedOrOpenStatus } from '../utils/get-closed-or-open-status';
import {
  accountContainer,
  notSupportedMessage,
  notSupportedTitle,
} from './account.css';

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

  const chooseIsOpen = getClosedOrOpenStatus(now, data);

  const logout = async () => {
    await signOut();
    // eslint-disable-next-line fp/no-mutating-methods
    await Router.push('/login');
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
        <div className={accountContainer}>
          <Account
            userDetails={user}
            chooseIsOpen={chooseIsOpen}
            logout={logout}
          />
        </div>
        <div className={notSupportedMessage}>
          <h2 className={notSupportedTitle}>Not Supported</h2>
          <ParagraphText>
            The beta release of our customer portal does not yet support mobile
            layouts. Check back soon!
          </ParagraphText>
        </div>
      </PageSpacing>
    </>
  );
};

export const getServerSideProps = authorizedRoute();

export default AccountPage;

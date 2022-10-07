import { useContext } from 'react';
import Image from 'next/image';
import { Hero, Account, AuthenticationServiceContext } from '@tnmw/components';
import { PageSpacing } from './page-spacing';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';

import { usePlan } from '../hooks';
import { getClosedOrOpenStatus } from '../utils/get-closed-or-open-status';
import { accountContainer } from './account.css';
import { RedirectIfLoggedOut } from '../components/authentication/redirect-if-logged-out';
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

const AccountPage = () => {
  const { data } = usePlan();

  const user = useMe();

  const now = new Date(Date.now());
  const { signOut } = useContext(AuthenticationServiceContext);

  if (!signOut) {
    throw new Error('Dependencies not configured!');
  }

  const chooseIsOpen = getClosedOrOpenStatus(now, data);

  const logout = async () => {
    await signOut();
  };

  return (
    <RedirectIfLoggedOut redirectTo="/login/">
      <Hero>
        <YourAccountHeaderBox>
          <Image
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
          {user && (
            <Account
              userDetails={user}
              chooseIsOpen={chooseIsOpen}
              logout={logout}
            />
          )}
        </div>
      </PageSpacing>
    </RedirectIfLoggedOut>
  );
};

export default AccountPage;

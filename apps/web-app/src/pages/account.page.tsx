import { useContext } from 'react';
import Image from 'next/image';
import { Hero, Account } from '@tnmw/components';
import { signOut } from '../aws/authenticate';
import { PageSpacing } from './page-spacing';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';

import { usePlan } from '../hooks';
import { getClosedOrOpenStatus } from '../utils/get-closed-or-open-status';
import { accountContainer } from './account.css';
import { RedirectIfLoggedOut } from '../components/authentication/redirect-if-logged-out';
import { useMe } from '../hooks/use-me';
import { NavigationContext } from '@tnmw/utils';

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

  const chooseIsOpen = getClosedOrOpenStatus(now, data);
  const { navigate } = useContext(NavigationContext);

  const logout = async () => {
    await signOut();
    await navigate('/login', false);
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
        <div className={notSupportedMessage}>
          <h2 className={notSupportedTitle}>Not Supported</h2>
          <ParagraphText>
            The beta release of our customer portal does not yet support mobile
            layouts. Check back soon!
          </ParagraphText>
        </div>
      </PageSpacing>
    </RedirectIfLoggedOut>
  );
};

export default AccountPage;

import { FC } from 'react';
import { LoginAndRegisterBox, Hero } from '@tnmw/components';
import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import { RedirectIfLoggedIn } from '../components/authentication/redirect-if-logged-in';

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

const Register: FC = () => {
  return (
    <RedirectIfLoggedIn redirectTo="/account">
      <Hero>
        <YourAccountHeaderBox>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AccountIcon} alt="" height="80" width="80" />
          <YourAccountHeader>Your Account</YourAccountHeader>
        </YourAccountHeaderBox>
      </Hero>
      <LoginAndRegisterBox defaultTab="Register" />
    </RedirectIfLoggedIn>
  );
};

export default Register;

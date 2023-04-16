import { FC } from 'react';
import { LoginAndRegisterBox, Hero } from '@tnmw/components';
import Image from 'next/image';
import { loader } from '../utils/loader';
import { RedirectIfLoggedIn } from '../components/authentication/redirect-if-logged-in';
import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';

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

const LoginAndRegisterPadding = styled('div')`
  width: 100%;
  border-top: 1px solid black;
  min-height: 5rem;
  height: 5rem;
`;

const Login: FC = () => {
  return (
    <RedirectIfLoggedIn redirectTo="/account/">
      <Hero>
        <YourAccountHeaderBox>
          <Image
            loader={loader}
            src={AccountIcon as unknown as string}
            alt=""
            height="80"
            width="80"
          />
          <YourAccountHeader>Your Account</YourAccountHeader>
        </YourAccountHeaderBox>
      </Hero>
      <LoginAndRegisterBox defaultTab="Login" />
      <LoginAndRegisterPadding />
    </RedirectIfLoggedIn>
  );
};

export default Login;

import { FC } from 'react';
import { LoginAndRegisterBox, Hero, Layout } from '@tnmw/components';
import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import { loggedOutOnlyRoute } from '../utils';

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
    <>
      <Hero>
        <YourAccountHeaderBox>
          <img src={AccountIcon} alt="" height="80" width="80" />
          <YourAccountHeader>Your Account</YourAccountHeader>
        </YourAccountHeaderBox>
      </Hero>
      <LoginAndRegisterBox defaultTab="Login" />
      <LoginAndRegisterPadding />
    </>
  );
};

export const getServerSideProps = loggedOutOnlyRoute('account');

export default Login;

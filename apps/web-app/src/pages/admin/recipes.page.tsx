import { FC } from 'react';
import { Hero, Layout, Button } from '@tnmw/components';
import Router from 'next/router';
import { signOut } from '../aws/authenticate';

import AccountIcon from '../images/TNM_Icons_Final_Account.png';
import styled from '@emotion/styled';
import { authorizedRoute } from '../utils/authorised-route';

const YourAccountHeader = styled('h1')`
  font-size: 40px;
  display: auto;
  margin: 0.5rem 0 0 0;
`;

const Account: FC = () => {
  return (
    <Layout>
      <Heading level={2}>
        Recipes
      </Heading>
    </Layout>
  );
};

export const getServerSideProps = authorizedRoute();

export default Account;

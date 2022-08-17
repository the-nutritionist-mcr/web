import { Header, Footer, AuthenticationServiceContext } from '../../organisms';
import { useAxe } from '../../hooks';
import { User, UserContext } from '../../contexts';
import styled from '@emotion/styled';
import React, { FC, ReactNode, useContext, useState } from 'react';
import { BackendCustomer } from '@tnmw/types';
import { Loading } from '@tnmw/components';

const MainContainer = styled('main')`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 0 1rem;
  min-height: 80vh;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout = (props: LayoutProps) => {
  useAxe();
  const { user } = useContext(AuthenticationServiceContext);

  return (
    <>
      <Header admin={Boolean(user?.isAdmin)} />
      <Loading>
        <MainContainer>{props.children}</MainContainer>
      </Loading>
      <Footer />
    </>
  );
};

export default Layout;

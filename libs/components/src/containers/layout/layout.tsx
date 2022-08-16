import { Header, Footer, AuthenticationServiceContext } from '../../organisms';
import { useAxe } from '../../hooks';
import { User, UserContext } from '../../contexts';
import styled from '@emotion/styled';
import React, { FC, ReactNode, useContext, useState } from 'react';
import { BackendCustomer } from '@tnmw/types';

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
      <MainContainer>{props.children}</MainContainer>
      <Footer />
    </>
  );
};

export default Layout;

import { Header, Footer } from '../../organisms';
import { useAxe } from '../../hooks';
import { User, UserContext } from '../../contexts';
import styled from '@emotion/styled';
import React, { FC, ReactNode, useState } from 'react';

const MainContainer = styled('main')`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 0 1rem;
  min-height: 80vh;
`;

interface LayoutProps {
  user?: User | undefined;
  children: ReactNode;
}

const Layout = (props: LayoutProps) => {
  const [user, setUser] = useState<User | undefined>(props.user);
  useAxe();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header admin={Boolean(user?.admin)} />
      <MainContainer>{props.children}</MainContainer>
      <Footer />
    </UserContext.Provider>
  );
};

export default Layout;

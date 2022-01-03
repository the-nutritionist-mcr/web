import { Header, Footer } from '../../organisms';
import { useAxe } from '../../hooks';
import { User, UserContext } from '../../contexts';
import styled from '@emotion/styled';
import React, { FC, useState } from 'react';

const MainContainer = styled('main')`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 4rem;
`;

interface LayoutProps {
  user?: User | undefined;
}

const Layout: FC<LayoutProps> = (props) => {
  const [user, setUser] = useState<User | undefined>(props.user);
  useAxe();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
      <MainContainer>{props.children}</MainContainer>
      <Footer />
    </UserContext.Provider>
  );
};

export default Layout;

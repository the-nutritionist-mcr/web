import { Header, Footer, AuthenticationServiceContext } from '../../organisms';
import { useAxe } from '../../hooks';
import styled from '@emotion/styled';
import { ReactNode, useContext } from 'react';
import { Loader } from '@tnmw/components';

const MainContainer = styled('main')`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 0 1rem;
  min-height: 80vh;
  width: 100%;
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
      <Loader>
        <MainContainer>{props.children}</MainContainer>
      </Loader>
      <Footer />
    </>
  );
};

export default Layout;

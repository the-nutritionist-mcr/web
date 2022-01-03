import { useBreakpoints } from '../../hooks';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { FC } from 'react';

import DesktopHeader from './desktop-header';
import MobileHeader from './mobile-header';

const SiteNavbar = styled('nav')`
  display: flex;
  flex-direction: row;
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-weight: 700;
  height: ${(props) => props.theme.menubarHeight}px;
  padding: 0 30px;
  border-bottom: 1px solid black;
  position: fixed;
  width: 100%;
  background-color: white;
`;

const Header: FC = () => {
  const theme = useTheme();
  const currentBreakpoint = useBreakpoints(theme.breakpoints);
  return (
    <SiteNavbar>
      {currentBreakpoint === 'large' ? <DesktopHeader /> : <MobileHeader />}
    </SiteNavbar>
  );
};

export default Header;

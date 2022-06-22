import { useBreakpoints } from '../../hooks';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

import DesktopHeader from './desktop-header';
import MobileHeader from './mobile-header';
import { AdminNav } from './admin-nav';

const SiteNavbarDesktop = styled('nav')`
  display: flex;
  flex-direction: column;
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-weight: 700;
  height: ${(props) => props.theme.menubarHeight}px;
  padding: 0 30px;
  border-bottom: 1px solid black;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
`;

const SiteNavbarMobile = styled('nav')`
  display: flex;
  align-items: center;
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-weight: 700;
  height: ${(props) => props.theme.menubarHeight}px;
  padding: 0 30px;
  border-bottom: 1px solid black;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
`;

interface HeaderProps {
  admin: boolean;
}

const Header = (props: HeaderProps) => {
  const theme = useTheme();
  const currentBreakpoint = useBreakpoints(theme.breakpoints);
  return currentBreakpoint === 'large' ? (
    <SiteNavbarDesktop>
      <DesktopHeader />
      {props.admin && <AdminNav />}
    </SiteNavbarDesktop>
  ) : (
    <SiteNavbarMobile>
      <MobileHeader />
    </SiteNavbarMobile>
  );
};

export default Header;

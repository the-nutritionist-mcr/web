import { useBreakpoints } from '../../hooks';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

import DesktopHeader from './desktop-header';
import MobileHeader from './mobile-header';
import { AdminNav } from './admin-nav';
import { siteNavbarDesktop, siteNavbarMobile } from './header.css';

interface HeaderProps {
  admin: boolean;
}

const Header = (props: HeaderProps) => {
  const theme = useTheme();
  const currentBreakpoint = useBreakpoints(theme.breakpoints);
  return currentBreakpoint === 'large' ? (
    <nav className={siteNavbarDesktop}>
      <DesktopHeader />
      {props.admin && <AdminNav />}
    </nav>
  ) : (
    <nav className={siteNavbarMobile}>
      <MobileHeader />
    </nav>
  );
};

export default Header;

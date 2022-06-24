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
  console.log(siteNavbarDesktop, siteNavbarMobile);
  const theme = useTheme();
  const currentBreakpoint = useBreakpoints(theme.breakpoints);
  return currentBreakpoint === 'large' ? (
    <nav key="one" className={siteNavbarDesktop}>
      <DesktopHeader />
      {props.admin && <AdminNav />}
    </nav>
  ) : (
    <nav key="two" className={siteNavbarMobile}>
      <MobileHeader />
    </nav>
  );
};

export default Header;

import { useBreakpoints } from '../../hooks';
import { useTheme } from '@emotion/react';

import DesktopHeader from './desktop-header';
import MobileHeader from './mobile-header';
import { AdminNav } from './admin-nav';
import {
  header,
  siteNavbarDesktop,
  headerMobile,
  mainMenuContainer,
} from './header.css';

interface HeaderProps {
  admin: boolean;
}

const Header = (props: HeaderProps) => {
  return (
    <header className={header}>
      <nav key="one" className={siteNavbarDesktop}>
        <div className={mainMenuContainer}>
          <DesktopHeader />
          {props.admin && <AdminNav />}
        </div>
      </nav>
    </header>
  );
};

export default Header;

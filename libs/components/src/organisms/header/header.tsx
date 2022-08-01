import DesktopHeader from './desktop-header';
import { AdminNav } from './admin-nav';
import { header, siteNavbarDesktop, mainMenuContainer } from './header.css';
import { ReactNode } from 'react';

interface HeaderProps {
  admin: boolean;
  children: ReactNode;
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

import DesktopHeader from './desktop-header';
import { AdminNav } from './admin-nav';
import {
  header,
  siteNavbarDesktop,
  mainMenuContainer,
  customerHeader,
  headerHidden,
} from './header.css';
import { useEffect, useState } from 'react';

interface HeaderProps {
  admin: boolean;
}

const isBrowser = typeof window !== 'undefined';

const Header = (props: HeaderProps) => {
  const [, setPrevScrollPos] = useState(isBrowser ? window.pageYOffset : 0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(currentScrollPos < 320);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerClasses = visible ? [header] : [header, headerHidden];

  return (
    <header className={headerClasses.join(' ')}>
      <div className={customerHeader}>
        <nav key="one" className={siteNavbarDesktop}>
          <div className={mainMenuContainer}>
            <DesktopHeader />
          </div>
        </nav>
      </div>
      {props.admin && <AdminNav />}
    </header>
  );
};

export default Header;

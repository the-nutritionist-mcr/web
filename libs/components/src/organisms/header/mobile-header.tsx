import { FC, useState } from 'react';
import Account from './account.svg';

import { MobileMenu } from './mobile-menu';
import { accountWrapper } from './mobile-header.css';

import { headerUnorderedListMobile } from './header.css';
import {
  menuButton,
  menuButtonContainer,
  mobileLogoLi,
  mobileHeaderGettingStartedButton,
  gettingStartedWrapper,
} from './mobile-header.css';
import { TNM_SITE } from './tnm-site';

const MobileHeader: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <MobileMenu show={showMenu} onClose={() => setShowMenu(false)} />
      <ul className={headerUnorderedListMobile}>
        <li className={menuButtonContainer}>
          <button
            className={menuButton}
            onClick={() => setShowMenu(true)}
            aria-label="Button"
          />
        </li>
        <li className={accountWrapper}>
          <a href="/account">
            <img src={Account} width="40" height="40" alt="Account" />
          </a>
        </li>

        <li className={mobileLogoLi}>
          <a href={TNM_SITE}>Home</a>
        </li>

        <li className={gettingStartedWrapper}>
          <a
            href={`${TNM_SITE}/get-started/`}
            className={mobileHeaderGettingStartedButton}
          >
            Get Started
          </a>
        </li>
      </ul>
    </>
  );
};

export default MobileHeader;

import { FC } from 'react';
import { MobileMenu } from './mobile-menu';
import Account from './account.svg';
import { TNM_SITE } from './tnm-site';
import { useState } from 'react';

import { headerUnorderedList, accountButton } from './header.css';
import {
  mobileLogoLi,
  getStartedButton,
  theNutritionistALink,
  headerListItem,
  menuButtonContainer,
  menuButton,
  menuAnchor,
  theNutritionistLogo,
  hideOnDesktop,
  mobileLogoNA,
  hideOnMobile,
} from './desktop-header.css';

const DesktopHeader: FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <MobileMenu show={showMenu} onClose={() => setShowMenu(false)} />
      <ul className={headerUnorderedList}>
        <li className={`${menuButtonContainer} ${hideOnDesktop}`}>
          <button
            className={menuButton}
            onClick={() => setShowMenu(true)}
            aria-label="Button"
          />
        </li>
        <li className={accountButton}>
          <a href="/account">
            <img src={Account} width="40" height="40" alt="Account" />
          </a>
        </li>
        <li className={`${headerListItem} ${hideOnMobile}`}>
          <a className={menuAnchor} href={`${TNM_SITE}/our-story/`}>
            Our Story
          </a>
        </li>
        <li className={`${headerListItem} ${hideOnMobile}`}>
          <a href={`${TNM_SITE}/why-choose-us/`} className={menuAnchor}>
            Why Choose Us
          </a>
        </li>
        <li className={`${theNutritionistLogo} ${hideOnMobile}`}>
          <a className={theNutritionistALink} href={TNM_SITE}>
            The Nutritionist MCR
          </a>
        </li>
        <li className={`${mobileLogoLi} ${hideOnDesktop}`}>
          <a className={mobileLogoNA} href={TNM_SITE}>
            Home
          </a>
        </li>
        <li className={`${headerListItem} ${hideOnMobile}`}>
          <a className={menuAnchor} href={`${TNM_SITE}/the-plans/`}>
            The Plans
          </a>
        </li>
        {process.env['APP_VERSION'] !== 'prod' ? (
          <li className={`${headerListItem} ${hideOnMobile}`}>
            <a className={menuAnchor} href={`${TNM_SITE}/pricing/`}>
              Pricing
            </a>
          </li>
        ) : null}
        <li className={headerListItem}>
          <a href={`${TNM_SITE}/get-started/`} className={getStartedButton}>
            Get Started
          </a>
        </li>
      </ul>
    </>
  );
};

export default DesktopHeader;

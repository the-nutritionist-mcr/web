import { FC } from 'react';
import Account from './account.svg';
import { TNM_SITE } from './tnm-site';

import { headerUnorderedList, accountButton } from './header.css';
import {
  getStartedButton,
  theNutritionistALink,
  headerListItem,
  menuAnchor,
  theNutritionistLogo,
} from './desktop-header.css';

const DesktopHeader: FC = () => (
  <ul className={headerUnorderedList}>
    <li className={accountButton}>
      <a href="/account">
        <img src={Account} width="40" height="40" alt="Account" />
      </a>
    </li>
    <li className={headerListItem}>
      <a className={menuAnchor} href={`${TNM_SITE}/our-story/`}>
        Our Story
      </a>
    </li>
    <li className={headerListItem}>
      <a href={`${TNM_SITE}/why-choose-us/`} className={menuAnchor}>
        Why Choose Us
      </a>
    </li>
    <li className={theNutritionistLogo}>
      <a className={theNutritionistALink} href={TNM_SITE}>
        The Nutritionist MCR
      </a>
    </li>
    <li className={headerListItem}>
      <a className={menuAnchor} href={`${TNM_SITE}/the-plans/`}>
        The Plans
      </a>
    </li>
    {process.env.NX_APP_ENV !== 'production' ? (
      <li className={headerListItem}>
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
);

export default DesktopHeader;

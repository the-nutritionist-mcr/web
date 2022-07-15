import { FC } from 'react';

import {
  getStartedButton,
  theNutritionistALink,
  headerListItem,
  accountButton,
  headerUnorderedList,
  menuAnchor,
  theNutritionistLogo,
} from './desktop-header.css';

const TNM_SITE =
  process.NODE_ENV === 'production'
    ? 'https://www.thenutritionistmcr.com'
    : 'https://staging.thenutritionistmcr.com';

const DesktopHeader: FC = () => (
  <ul className={headerUnorderedList}>
    <li className={accountButton}>
      <a href="/account">Accounts</a>
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
    <li className={headerListItem}>
      <a className={menuAnchor} href={`${TNM_SITE}/pricing/`}>
        Pricing
      </a>
    </li>
    <li className={headerListItem}>
      <a href={`${TNM_SITE}/get-started/`} className={getStartedButton}>
        Get Started
      </a>
    </li>
  </ul>
);

export default DesktopHeader;

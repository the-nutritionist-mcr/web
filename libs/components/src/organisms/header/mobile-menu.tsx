import { TNM_SITE } from './tnm-site';

import closeButtonIcon from './TNM_Icon__Exit_9bd47247.svg';
import {
  mobileMenuItem,
  closeButton,
  mobileMenuUl,
  mobileMenuAnchor,
  mobileMenuContainer,
  iconTag,
} from './mobile-menu.css';

interface MobileMenuProps {
  show: boolean;
  onClose: () => void;
}

export const MobileMenu = (props: MobileMenuProps) =>
  props.show ? (
    <div className={mobileMenuContainer}>
      <ul className={mobileMenuUl}>
        <button className={closeButton} onClick={props.onClose}>
          <img className={iconTag} src={closeButtonIcon} alt="Close" />
        </button>
        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href={TNM_SITE}>
            Home
          </a>
        </li>

        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href={`${TNM_SITE}/our-story/`}>
            Our Story
          </a>
        </li>

        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href={`${TNM_SITE}/why-choose-us/`}>
            Why Choose Us
          </a>
        </li>
        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href={`${TNM_SITE}/the-plans/`}>
            The Plans
          </a>
        </li>

        {process.env['APP_VERSION'] !== 'prod' ? (
          <li className={mobileMenuItem}>
            <a className={mobileMenuAnchor} href={`${TNM_SITE}/pricing/`}>
              Pricing
            </a>
          </li>
        ) : null}
        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href={`${TNM_SITE}/get-started/`}>
            Get Started
          </a>
        </li>
      </ul>
    </div>
  ) : null;

import styled from '@emotion/styled';

import { TNM_SITE } from './tnm-site';

import closeButton from './TNM_Icon__Exit_9bd47247.svg';
import {
  mobileMenuItem,
  mobileMenuUl,
  mobileMenuAnchor,
} from './mobile-menu.css';

const MobileMenuContainer = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #f3b762;
  position: fixed;
  padding: 30px;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
`;

const StyledIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const CloseButton = styled.button`
  border: 0;
  background: 0;
  top: 30px;
  right: 30px;
  position: absolute;
`;

const MobileMenuUl = styled.ul`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MobileMenuA = styled.a`
  font-size: 37px;
  padding: 15px 0;
  width: 100%;
  display: block;
  font-family: 'Acumin Pro Semicondensed';
  text-decoration: none;
  color: black;
`;

interface MobileMenu {
  show: boolean;
  onClose: () => void;
}

export const MobileMenu = (props: MobileMenu) =>
  props.show ? (
    <MobileMenuContainer>
      <ul className={mobileMenuUl}>
        <CloseButton onClick={props.onClose}>
          <StyledIcon src={closeButton} />
        </CloseButton>
        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href="/">
            Home
          </a>
        </li>

        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href="/">
            Our Story
          </a>
        </li>

        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href="/">
            Why Choose Us
          </a>
        </li>
        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href="/">
            The Plans
          </a>
        </li>
        <li className={mobileMenuItem}>
          <a className={mobileMenuAnchor} href="/">
            Get Started
          </a>
        </li>
      </ul>
    </MobileMenuContainer>
  ) : null;

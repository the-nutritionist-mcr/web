import { Button } from '../../atoms';
import styled from '@emotion/styled';
import { FC } from 'react';

import TnmHeader from './TNM-Header.svg';

import {
  headerListItem,
  headerUnorderedList,
  menuAnchor,
  theNutritionistLogo,
} from './desktop-header.css';

const DesktopHeader: FC = () => (
  <ul className={headerUnorderedList}>
    <li className={headerListItem}>
      <a className={menuAnchor} href="/our-story/">
        Our Story
      </a>
    </li>
    <li className={headerListItem}>Why Choose Us</li>
    <li className={headerListItem}>
      <a className={theNutritionistLogo} href="/">
        The Nutritionist MCR
      </a>
    </li>
    <li className={headerListItem}>The Plans</li>
    <li className={headerListItem}>
      <Button primary backgroundColor="buttonBlack">
        Get Started
      </Button>
    </li>
  </ul>
);

export default DesktopHeader;

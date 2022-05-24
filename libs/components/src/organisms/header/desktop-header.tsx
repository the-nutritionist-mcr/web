import { Button } from '../../atoms';
import styled from '@emotion/styled';
import { FC } from 'react';

import TnmHeader from './TNM-Header.svg';

const HeaderUnorderedList = styled('ul')`
  display: flex;
  width: 100%;
  font-size: 21px;
  justify-content: space-between;
  margin: 0;
  height: 100%;
  align-items: center;
`;

const TheNutritionistLogo = styled('a')`
  background: url(${TnmHeader});
  width: 313px;
  height: 34px;
  display: block;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
`;

const HeaderListItem = styled('li')`
  list-style: none;
  margin: 0;
  white-space: nowrap;
`;

const MenuAnchor = styled('a')`
  text-decoration: none;
  color: ${(props) => props.theme.colors.buttonBlack};
`;
MenuAnchor.displayName = 'a';

const DesktopHeader: FC = () => (
  <>
    <HeaderUnorderedList>
      <HeaderListItem>
        <MenuAnchor href="/our-story/">Our Story</MenuAnchor>
      </HeaderListItem>
      <HeaderListItem>Why Choose Us</HeaderListItem>
      <HeaderListItem>
        <TheNutritionistLogo href="/">The Nutritionist MCR</TheNutritionistLogo>
      </HeaderListItem>
      <HeaderListItem>The Plans</HeaderListItem>
      <HeaderListItem>
        <Button primary>Get Started</Button>
      </HeaderListItem>
    </HeaderUnorderedList>
  </>
);

export default DesktopHeader;

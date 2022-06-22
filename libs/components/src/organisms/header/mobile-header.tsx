import styled from '@emotion/styled';
import { FC, Fragment } from 'react';

import { Button } from '../../atoms';
import menuSvg from './menu.svg';
import tnmNLogo from './tnm-n-logo.svg';

const StyledMenuIcon = styled.img`
  width: 40px;
  height: 40px;
`;
const MenuButtonContainerLeft = styled('div')`
  margin: 24px 0;
  width: 200px;
  text-align: left;
  flex-grow: 100;
`;

const LogoContainer = styled('div')`
  margin: 24px 0;
`;

const MenuButtonContainerRight = styled('div')`
  margin: 24px 0;
  width: 200px;
  text-align: right;
  flex-grow: 100;
`;

const StyledTnmLogo = styled.img`
  width: 60px;
  height: 60px;
  flex-grow: 100;
`;

const MobileHeader: FC = () => (
  <Fragment>
    <MenuButtonContainerLeft>
      <StyledMenuIcon src={menuSvg} />
    </MenuButtonContainerLeft>
    <LogoContainer>
      <StyledTnmLogo src={tnmNLogo} />
    </LogoContainer>
    <MenuButtonContainerRight>
      <Button primary>Get Started</Button>
    </MenuButtonContainerRight>
  </Fragment>
);

export default MobileHeader;

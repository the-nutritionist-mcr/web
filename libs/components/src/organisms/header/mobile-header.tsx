import styled from '@emotion/styled';
import { FC, Fragment, useState } from 'react';

import { Button } from '../../atoms';
import menuSvg from './menu.svg';
import { MobileMenu } from './mobile-menu';
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

const MenuButton = styled.button`
  border: 0;
  background: 0;
`;

const MobileHeader: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <Fragment>
      <MobileMenu show={showMenu} />
      <MenuButtonContainerLeft>
        <MenuButton onClick={() => setShowMenu(true)}>
          <StyledMenuIcon src={menuSvg} />
        </MenuButton>
      </MenuButtonContainerLeft>
      <LogoContainer>
        <StyledTnmLogo src={tnmNLogo} />
      </LogoContainer>
      <MenuButtonContainerRight>
        <Button primary>Get Started</Button>
      </MenuButtonContainerRight>
    </Fragment>
  );
};

export default MobileHeader;

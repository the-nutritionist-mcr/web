import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
import { Fragment } from 'react';
import { Button } from '../../atoms';
import menuSvg from './menu.svg';
import tnmNLogo from './tnm-n-logo.svg';
const StyledMenuIcon = styled.img `
  width: 40px;
  height: 40px;
`;
const MenuButtonContainerLeft = styled('div') `
  margin: 24px 0;
  width: 200px;
  text-align: left;
  flex-grow: 100;
`;
const LogoContainer = styled('div') `
  margin: 24px 0;
`;
const MenuButtonContainerRight = styled('div') `
  margin: 24px 0;
  width: 200px;
  text-align: right;
  flex-grow: 100;
`;
const StyledTnmLogo = styled.img `
  width: 40px;
  height: 40px;
  flex-grow: 100;
`;
const MobileHeader = () => (_jsxs(Fragment, { children: [_jsx(MenuButtonContainerLeft, { children: _jsx(StyledMenuIcon, { src: menuSvg }, void 0) }, void 0), _jsx(LogoContainer, { children: _jsx(StyledTnmLogo, { src: tnmNLogo }, void 0) }, void 0), _jsx(MenuButtonContainerRight, { children: _jsx(Button, Object.assign({ primary: true }, { children: "Get Started" }), void 0) }, void 0)] }, void 0));
export default MobileHeader;
//# sourceMappingURL=mobile-header.js.map
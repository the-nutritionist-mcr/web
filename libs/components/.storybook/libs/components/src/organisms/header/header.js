import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { useBreakpoints } from '../../hooks';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import DesktopHeader from './desktop-header';
import MobileHeader from './mobile-header';
const SiteNavbar = styled('nav') `
  display: flex;
  flex-direction: row;
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-weight: 700;
  height: ${(props) => props.theme.menubarHeight}px;
  padding: 0 30px;
  border-bottom: 1px solid black;
  position: fixed;
  width: 100%;
  background-color: white;
`;
const Header = () => {
    const theme = useTheme();
    const currentBreakpoint = useBreakpoints(theme.breakpoints);
    return (_jsx(SiteNavbar, { children: currentBreakpoint === 'large' ? _jsx(DesktopHeader, {}, void 0) : _jsx(MobileHeader, {}, void 0) }, void 0));
};
export default Header;
//# sourceMappingURL=header.js.map
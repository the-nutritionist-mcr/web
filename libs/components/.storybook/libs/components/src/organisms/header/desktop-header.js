import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { Button } from '../../atoms';
import styled from '@emotion/styled';
import TnmHeader from './TNM-Header.svg';
const HeaderUnorderedList = styled('ul') `
  display: flex;
  width: 100%;
  font-size: 21px;
  justify-content: space-between;
  margin: 0;
  height: 100%;
  align-items: center;
`;
const TheNutritionistLogo = styled('a') `
  background: url(${TnmHeader});
  width: 313px;
  height: 34px;
  display: block;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
`;
const HeaderListItem = styled('li') `
  list-style: none;
  margin: 0;
  white-space: nowrap;
`;
const MenuAnchor = styled('a') `
  text-decoration: none;
  color: ${(props) => props.theme.colors.buttonBlack};
`;
MenuAnchor.displayName = 'a';
const DesktopHeader = () => (_jsxs(HeaderUnorderedList, { children: [_jsx(HeaderListItem, { children: _jsx(MenuAnchor, Object.assign({ href: "/our-story/" }, { children: "Our Story" }), void 0) }, void 0), _jsx(HeaderListItem, { children: "Why Choose Us" }, void 0), _jsx(HeaderListItem, { children: _jsx(TheNutritionistLogo, Object.assign({ href: "/" }, { children: "The Nutritionist MCR" }), void 0) }, void 0), _jsx(HeaderListItem, { children: "The Plans" }, void 0), _jsx(HeaderListItem, { children: _jsx(Button, Object.assign({ primary: true }, { children: "Get Started" }), void 0) }, void 0)] }, void 0));
export default DesktopHeader;
//# sourceMappingURL=desktop-header.js.map
import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
import tnmFullWhite from './TNM-Full-white.svg';
import SeasonalPattern from './Seasonal-pattern-spring-tnm.png';
const StyledFooter = styled.footer `
  width: 100%;
  font-family: 'Acumin Pro', Arial, sans-serif;
  box-sizing: border-box;
  position: relative;
  background: #253a3d;
`;
const FooterStrip = styled.div `
  background: url(${SeasonalPattern});
  background-size: cover;
  background-position: 50%;
  height: 125px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;
const FooterContent = styled.div `
  padding: 100px 30px;
  background: #253a3d;
  color: white;
`;
const FooterColumns = styled.div `
  display: flex;
  justify-content: space-between;
`;
const FooterHeaders = styled.h2 `
  margin: 0;
  padding: 0;
  color: #177f7a;
  font-size: 45px;
  line-height: 49px;
  font-weight: 700;
`;
const FooterLink = styled.a `
  color: #cafbe2;
  font-size: 27px;
  line-height: 33px;
  font-family: acumin-pro-semi-condensed, sans-serif;
  text-decoration: none;
`;
const FooterLi = styled.li `
  margin: 20px 0;
  padding: 0;
`;
const UnStyledUl = styled.ul `
  list-style: none;
  padding: 0;
`;
const TnmLogoWhiteAnchor = styled.a `
  text-indent: -9999px;
  width: 422px;
  height: 46px;
  display: block;
  margin-bottom: 100px;
  background: url(${tnmFullWhite});
`;
const Footer = () => (_jsxs(StyledFooter, { children: [_jsx(FooterStrip, { "aria-hidden": true }, void 0), _jsxs(FooterContent, { children: [_jsx(TnmLogoWhiteAnchor, Object.assign({ href: "/" }, { children: "The Nutritionist MCR" }), void 0), _jsxs(FooterColumns, { children: [_jsx("div", { children: _jsx(FooterHeaders, { children: "Sign up to emails" }, void 0) }, void 0), _jsxs("div", { children: [_jsx(FooterHeaders, { children: "Order" }, void 0), _jsxs(UnStyledUl, { children: [_jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/the-plans/#UnStyledUltra-Micro" }, { children: "Ultra Micro" }), void 0) }, void 0), _jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/the-plans/#Micro" }, { children: "Micro" }), void 0) }, void 0), _jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/the-plans/#Equilibrium" }, { children: "Equilibrium" }), void 0) }, void 0), _jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/the-plans/#Mass" }, { children: "Mass" }), void 0) }, void 0)] }, void 0)] }, void 0), _jsxs("div", { children: [_jsx(FooterHeaders, { children: "About" }, void 0), _jsxs(UnStyledUl, { children: [_jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/our-story" }, { children: "Our Story" }), void 0) }, void 0), _jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/why-choose-us" }, { children: "Why Choose Us?" }), void 0) }, void 0), _jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/the-plans" }, { children: "Meal Plans" }), void 0) }, void 0)] }, void 0)] }, void 0), _jsxs("div", { children: [_jsx(FooterHeaders, { children: "Contact" }, void 0), _jsxs(UnStyledUl, { children: [_jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/faq" }, { children: "FAQ" }), void 0) }, void 0), _jsx(FooterLi, { children: _jsx(FooterLink, Object.assign({ href: "/get-started" }, { children: "Get Started" }), void 0) }, void 0)] }, void 0)] }, void 0)] }, void 0)] }, void 0)] }, void 0));
export default Footer;
//# sourceMappingURL=footer.js.map
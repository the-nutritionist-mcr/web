import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { TabBox, Tab, Box } from '../../containers';
import styled from '@emotion/styled';
import LoginBox from './login-box';
import RegisterBox from './register-box';
const Padding = styled.div `
  padding: 1.5rem 5rem 3rem 5rem;
`;
const LoginAndRegisterBox = (props) => (_jsx(Box, { children: _jsxs(TabBox, Object.assign({ defaultTab: props.defaultTab, onChange: (tab) => {
            window.history.replaceState(null, '', `/${tab.props.tabTitle.toLocaleLowerCase()}/`);
        } }, { children: [_jsx(Tab, Object.assign({ tabTitle: "Login" }, { children: _jsx(Padding, { children: _jsx(LoginBox, {}, void 0) }, void 0) }), void 0), _jsx(Tab, Object.assign({ tabTitle: "Register" }, { children: _jsx(Padding, { children: _jsx(RegisterBox, {}, void 0) }, void 0) }), void 0)] }), void 0) }, void 0));
export default LoginAndRegisterBox;
//# sourceMappingURL=login-and-register-box.js.map
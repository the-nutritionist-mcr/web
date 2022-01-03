import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { Header, Footer } from '../../organisms';
import { useAxe } from '../../hooks';
import { UserContext } from '../../contexts';
import styled from '@emotion/styled';
import { useState } from 'react';
const MainContainer = styled('main') `
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 4rem;
`;
const Layout = (props) => {
    const [user, setUser] = useState(props.user);
    useAxe();
    return (_jsxs(UserContext.Provider, Object.assign({ value: { user, setUser } }, { children: [_jsx(Header, {}, void 0), _jsx(MainContainer, { children: props.children }, void 0), _jsx(Footer, {}, void 0)] }), void 0));
};
export default Layout;
//# sourceMappingURL=layout.js.map
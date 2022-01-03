import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const TabContents = styled.div `
  width: 100%;
`;
const Tab = (props) => {
    return _jsx(TabContents, Object.assign({ role: "tabpanel" }, { children: props.children }), void 0);
};
export default Tab;
//# sourceMappingURL=tab.js.map
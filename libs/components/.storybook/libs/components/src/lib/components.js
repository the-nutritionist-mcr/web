import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const StyledComponents = styled.div `
  color: pink;
`;
export function Components(props) {
    return (_jsx(StyledComponents, { children: _jsx("h1", { children: "Welcome to Components!" }, void 0) }, void 0));
}
export default Components;
//# sourceMappingURL=components.js.map
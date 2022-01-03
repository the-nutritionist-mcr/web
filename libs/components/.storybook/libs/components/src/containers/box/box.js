import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const BoxContainer = styled.div `
  width: 500px;
  border: 1px solid black;
  margin-top: -1px;
`;
const Box = (props) => {
    return _jsx(BoxContainer, { children: props.children }, void 0);
};
export default Box;
//# sourceMappingURL=box.js.map
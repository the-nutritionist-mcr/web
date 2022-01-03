import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const StyledP = styled.p `
  font-family: 'IBM Plex Serif', 'Times New Roman', serif;
`;
const ParagraphText = (props) => {
    return _jsx(StyledP, { children: props.children }, void 0);
};
export default ParagraphText;
//# sourceMappingURL=paragraph-text.js.map
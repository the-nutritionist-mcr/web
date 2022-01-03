import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const StyledButton = styled('button') `
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 0;
  border: 0;
  background: 0;
  cursor: pointer;
  border-radius: 50%;

  &:disabled {
    cursor: default;
    opacity: 0.3;
  }

  &:hover:enabled {
    filter: opacity(50%);
  }
`;
StyledButton.displayName = 'button';
const VisuallyHiddenText = styled.span `
  position: absolute;
  overflow: hidden;
  margin: 0px;
  width: 1px;
  height: 1px;
  clip-path: inset(100%);
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
`;
const IconButton = (props) => (_jsxs(StyledButton, Object.assign({ onClick: props.onClick, disabled: props.disabled }, { children: [_jsx("img", { src: props.icon, alt: "", width: "40px", height: "40px" }, void 0), _jsx(VisuallyHiddenText, { children: props.a11yLabel }, void 0)] }), void 0));
export default IconButton;
//# sourceMappingURL=icon-button.js.map
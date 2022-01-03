import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const TabButton = (props) => {
    const StyledButton = styled.button `
    font-family: 'Acumin Pro', Arial, sans-serif;
    font-weight: bold;
    width: calc(100% / ${props.tabListLength});
    margin: 0;
    cursor: pointer;
    padding: 1rem 3rem;
    font-size: 2rem;
    background: ${props.active ? 'white' : '#E3E3E3'};
    border-bottom: ${props.active ? '0' : '1px solid black'};
    border-top: 0;
    border-left: 0;
    border-right: 0;

    &:not(:first-of-type) {
      border-left: 1px solid black;
    }
    /* stylelint-disable */
  `;
    StyledButton.displayName = 'button';
    return (_jsx(StyledButton, Object.assign({ role: "tab", onClick: props.onClick, "aria-selected": props.active }, { children: props.children }), void 0));
};
export default TabButton;
//# sourceMappingURL=tab-button.js.map
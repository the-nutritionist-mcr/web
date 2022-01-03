import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const MealsSelectionsTabButton = (props) => {
    const StyledButton = styled.button `
    font-family: 'Acumin Pro', Arial, sans-serif;
    width: calc(100% / ${props.tabListLength});
    margin: 0 0 1rem 0;
    border: 0;
    cursor: pointer;
    padding: 1rem 3rem;
    font-size: 2rem;
    background: white;
    color: ${props.active ? `black` : `#939393`};
    text-decoration: ${props.active ? `underline` : `none`};
  `;
    StyledButton.displayName = 'button';
    return (_jsx(StyledButton, Object.assign({ role: "tab", onClick: props.onClick, "aria-selected": props.active }, { children: props.children }), void 0));
};
export default MealsSelectionsTabButton;
//# sourceMappingURL=tab-button.js.map
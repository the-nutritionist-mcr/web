import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
const ButtonElement = styled.button((props) => {
    let _a;
    const theme = useTheme();
    const color = (_a = props.color) !== null && _a !== void 0 ? _a : theme.colors.buttonBlack;
    return {
        height: '100%',
        borderRadius: '25px',
        border: props.primary ? `1px solid ${color}` : 0,
        cursor: 'pointer',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        background: props.primary ? color : 'white',
        color: props.primary ? 'white' : color,
        lineHeight: '17px',
        fontSize: '16px',
        fontWeight: 700,
        padding: '10px 30px',
        textDecoration: props.primary ? 0 : 'underline',
        '&:hover': {
            color: props.primary ? color : 'white',
            backgroundColor: props.primary ? 'white' : color,
        },
    };
});
ButtonElement.displayName = 'button';
const Button = (props) => (_jsx(ButtonElement, Object.assign({}, props, { children: props.children }), void 0));
export default Button;
//# sourceMappingURL=button.js.map
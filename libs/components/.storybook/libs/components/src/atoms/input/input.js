import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
const InputContainer = styled.div `
  font-family: 'Acumin Pro', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  flex-grow: 999;
`;
const LabelRow = styled.div `
  display: flex;
  flex-direction: row;
  gap: 0.2rem;
`;
const ErrorLabel = styled.label `
  font-family: 'Acumin Pro', Arial, sans-serif;
  color: red;
  padding-bottom: 0.5rem;
  font-style: italic;
`;
ErrorLabel.displayName = 'label';
const InputLabel = styled.label(() => {
    const theme = useTheme();
    return {
        fontFamily: '"Acumin Pro", Arial, sans-serif',
        color: theme.colors.labelText,
        flexGrow: 999,
        paddingBottom: '0.5rem',
    };
});
InputLabel.displayName = 'label';
const InputField = styled.input((props) => {
    const theme = useTheme();
    return {
        fontFamily: '"Acumin Pro", Arial, sans-serif',
        margin: 0,
        borderRadius: 0,
        border: `1px solid ${props.error ? 'red' : theme.colors.buttonBlack}`,
        lineHeight: `1.5rem`,
        padding: `0.5rem 0.5rem`,
    };
});
InputField.displayName = 'input';
const Input = (props) => (_jsxs(InputContainer, { children: [_jsx(LabelRow, { children: _jsx(InputLabel, Object.assign({ htmlFor: props.name }, { children: props.label }), void 0) }, void 0), _jsx(InputField, { id: props.name, name: props.name, value: props.value, error: props.error, type: props.type, onChange: props.onChange, placeholder: props.placeholder }, void 0)] }, void 0));
export default Input;
//# sourceMappingURL=input.js.map
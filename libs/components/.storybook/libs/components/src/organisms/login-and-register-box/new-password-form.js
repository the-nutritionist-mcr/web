import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';
const StyledP = styled.p `
  font-family: 'Acumin Pro', Arial, sans-serif;
`;
const NewPasswordForm = (props) => (_jsxs(ChallengeForm, Object.assign({ onSubmit: props.onSubmit, errors: props.errors }, { children: [_jsx(StyledP, { children: "You need to change your password. Enter a new one in the box below:" }, void 0), _jsx(Input, { label: "Password", name: "password" }, void 0)] }), void 0));
export default NewPasswordForm;
//# sourceMappingURL=new-password-form.js.map
import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';
import styled from '@emotion/styled';
const StyledLink = styled.a((props) => {
    return `
  font-family: "Acumin Pro", Arial, sans-serif;
  color: ${props.theme.colors.buttonBlack};
  text-decoration: 0;
`;
});
const LoginForm = (props) => (_jsxs(ChallengeForm, Object.assign({ submitText: "Login", onSubmit: props.onSubmit, errors: props.errors }, { children: [_jsx(Input, { label: "Email", placeholder: "a@b.com", name: "email", type: "email" }, void 0), _jsx(Input, { label: "Password", name: "password", type: "password" }, void 0), _jsx(StyledLink, Object.assign({ href: "#" }, { children: "Forgot your password?" }), void 0)] }), void 0));
export default LoginForm;
//# sourceMappingURL=login-form.js.map
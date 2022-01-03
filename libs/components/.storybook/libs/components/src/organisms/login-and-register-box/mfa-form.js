import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';
const StyledP = styled.p `
  font-family: 'Acumin Pro', Arial, sans-serif;
`;
const MfaForm = (props) => (_jsxs(ChallengeForm, Object.assign({ onSubmit: props.onSubmit }, { children: [_jsx(StyledP, { children: "A code has been sent to your phone. Please enter it in the box below." }, void 0), _jsx(Input, { label: "Code", name: "code" }, void 0)] }), void 0));
export default MfaForm;
//# sourceMappingURL=mfa-form.js.map
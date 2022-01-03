import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';
const StyledP = styled.p `
  font-family: 'Acumin Pro', Arial, sans-serif;
`;
const ConfirmMobileForm = (props) => (_jsxs(ChallengeForm, Object.assign({ onSubmit: props.onSubmit }, { children: [_jsx(StyledP, { children: "Signup was successful. To verify your phone number, please enter the code that was sent to your phone in the box below:" }, void 0), _jsx(Input, { label: "Code", name: "code" }, void 0)] }), void 0));
export default ConfirmMobileForm;
//# sourceMappingURL=ConfirmMobileForm.js.map
import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';
import styled from '@emotion/styled';
const FieldRow = styled.div `
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
`;
const FormDivider = styled.hr `
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  width: 100%;
  height: 1px;
  margin: -5px 0;
  border: 0;
`;
const RegisterForm = (props) => {
    return (_jsxs(ChallengeForm, Object.assign({ submitText: "Register", onSubmit: props.onSubmit, errors: props.errors }, { children: [_jsx(Input, { label: "Username", name: "username" }, void 0), _jsx(Input, { label: "Email Address", name: "email", type: "email", placeholder: "a@b.c" }, void 0), _jsxs(FieldRow, { children: [_jsx(Input, { label: "Password", name: "password", type: "password" }, void 0), _jsx(Input, { label: "Verify Password", name: "verifyPassword", type: "password" }, void 0)] }, void 0), _jsxs(FieldRow, { children: [_jsx(Input, { label: "First Name", name: "firstName" }, void 0), _jsx(Input, { label: "Last Name", name: "lastName" }, void 0)] }, void 0), _jsx(Input, { label: "Contact Number", name: "telephone" }, void 0), _jsx(FormDivider, {}, void 0), _jsxs(FieldRow, { children: [_jsx(Input, { label: "Address Line 1", name: "addressLine1" }, void 0), _jsx(Input, { label: "County", name: "county" }, void 0)] }, void 0), _jsxs(FieldRow, { children: [_jsx(Input, { label: "Address Line 2", name: "addressLine2" }, void 0), _jsx(Input, { label: "Postcode", name: "postcode" }, void 0)] }, void 0), _jsx(Input, { label: "Town/City", name: "townOrCity" }, void 0), _jsx(FormDivider, {}, void 0)] }), void 0));
};
export default RegisterForm;
//# sourceMappingURL=register-form.js.map
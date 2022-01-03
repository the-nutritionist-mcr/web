import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { Button } from '../../atoms';
import { addNewProps } from '../../utils';
import styled from '@emotion/styled';
import { useState, } from 'react';
const FlexForm = styled.form `
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const FormHeader = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const FormError = styled.div `
  color: red;
  height: 1em;
  font-family: 'Acumin Pro', Arial, sans-serif;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
`;
const StyledH2 = styled.h2 `
  font-family: 'Acumin Pro', Arial, sans-serif;
  margin: 0 0 0 0;
`;
StyledH2.displayName = 'h2';
const findMessage = (errorMessages, name) => errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.find((message) => { let _a; return (_a = message.fields) === null || _a === void 0 ? void 0 : _a.includes(name); });
const addErrorMessages = (nodes, errorMessages) => addNewProps(nodes, ({ props: { name } }) => ({
    apply: Boolean(findMessage(errorMessages, name)),
    props: { error: true },
}));
const addEventHandlers = (nodes, data, setData) => addNewProps(nodes, ({ props: { name } }) => ({
    apply: name,
    props: {
        onChange: (event) => setData(Object.assign(Object.assign({}, data), { [name]: event.target.value })),
    },
}));
function assertFC(_component
// eslint-disable-next-line @typescript-eslint/no-empty-function
) { }
function ChallengeForm(props) {
    let _a, _b, _c, _d;
    const [data, setData] = useState();
    const eventHandlersAdded = addEventHandlers(props.children, data, setData);
    const errorMessagesAdded = addErrorMessages(eventHandlersAdded, (_a = props.errors) !== null && _a !== void 0 ? _a : []);
    const formErrors = (_c = (_b = props.errors) === null || _b === void 0 ? void 0 : _b.filter((error) => !error.fields)) !== null && _c !== void 0 ? _c : [];
    return (_jsxs(FlexForm, { children: [_jsx(FormHeader, { children: _jsx(FormError, Object.assign({ role: "alert" }, { children: formErrors
                        .map((error) => error.message.endsWith('.')
                        ? error.message.slice(0, -1)
                        : error.message)
                        .join(', ') }), void 0) }, void 0), errorMessagesAdded, _jsx(Button, Object.assign({ primary: true, onClick: (event) => {
                    let _a;
                    if (data) {
                        (_a = props.onSubmit) === null || _a === void 0 ? void 0 : _a.call(props, data);
                        event.preventDefault();
                    }
                } }, { children: (_d = props.submitText) !== null && _d !== void 0 ? _d : 'Submit' }), void 0)] }, void 0));
}
assertFC(ChallengeForm);
export default ChallengeForm;
//# sourceMappingURL=challenge-form.js.map
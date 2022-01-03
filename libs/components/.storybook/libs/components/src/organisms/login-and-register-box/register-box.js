import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import ConfirmMobileForm from './ConfirmMobileForm';
import RegisterForm from './register-form';
import { RegisterState, useRegisterBox } from './use-register-box';
const getRegisterBox = (_state) => {
    if (_state === RegisterState.DoRegister) {
        return RegisterForm;
    }
    return ConfirmMobileForm;
};
const RegisterBox = () => {
    const { onSubmit, registerState, errorMessage } = useRegisterBox();
    const ChosenRegisterForm = getRegisterBox(registerState);
    return (_jsx(ChosenRegisterForm, { onSubmit: onSubmit, errors: errorMessage ? [errorMessage] : undefined }, void 0));
};
export default RegisterBox;
//# sourceMappingURL=register-box.js.map
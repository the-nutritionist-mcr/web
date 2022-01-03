import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import LoginForm from './login-form';
import MfaForm from './mfa-form';
import NewPasswordForm from './new-password-form';
import { useLoginBox } from './use-login-box';
export var LoginState;
(function (LoginState) {
    LoginState["DoLogin"] = "DoLogin";
    LoginState["ChangePasswordChallenge"] = "ChangePasswordChallenge";
    LoginState["MfaChallenge"] = "MfaChallenge";
})(LoginState || (LoginState = {}));
const getLoginBox = (state) => {
    switch (state) {
        case LoginState.DoLogin:
            return LoginForm;
        case LoginState.ChangePasswordChallenge:
            return NewPasswordForm;
        case LoginState.MfaChallenge:
            return MfaForm;
    }
};
const LoginBox = () => {
    const { errorMessage, onSubmit, loginState } = useLoginBox();
    const ChosenLoginForm = getLoginBox(loginState);
    return (_jsx(ChosenLoginForm, { errors: errorMessage ? [errorMessage] : undefined, onSubmit: onSubmit }, void 0));
};
export default LoginBox;
//# sourceMappingURL=login-box.js.map
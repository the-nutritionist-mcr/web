import { __awaiter } from "tslib";
import { useContext, useState } from 'react';
import { AuthenticationServiceContext } from './authentication-service-context';
import { NavigationContext } from './navigation-context';
export var LoginState;
(function (LoginState) {
    LoginState["DoLogin"] = "DoLogin";
    LoginState["ChangePasswordChallenge"] = "ChangePasswordChallenge";
    LoginState["MfaChallenge"] = "MfaChallenge";
})(LoginState || (LoginState = {}));
const isChangePasswordData = (formData, loginState) => formData.hasOwnProperty('password') &&
    loginState === LoginState.ChangePasswordChallenge;
const isLoginData = (formData, loginState) => formData.hasOwnProperty('email') && loginState === LoginState.DoLogin;
export const useLoginBox = () => {
    const { login, newPasswordChallengeResponse } = useContext(AuthenticationServiceContext);
    const { navigate } = useContext(NavigationContext);
    if (!login || !newPasswordChallengeResponse || !navigate) {
        throw new Error('Dependencies not configured!');
    }
    const [errorMessage, setErrorMessage] = useState();
    const [loginState, setLoginState] = useState(LoginState.DoLogin);
    const [response, setResponse] = useState();
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (isLoginData(data, loginState)) {
                const loginResponse = yield login(data.email, data.password);
                console.log(loginResponse);
                setResponse(loginResponse);
                if (loginResponse.challengeName === 'SMS_MFA') {
                    setLoginState(LoginState.MfaChallenge);
                    return;
                }
                if (loginResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    setLoginState(LoginState.ChangePasswordChallenge);
                    return;
                }
                if (loginResponse.success) {
                    navigate('/account/');
                }
            }
            if (isChangePasswordData(data, loginState)) {
                const newPasswordResponse = yield newPasswordChallengeResponse(response, data.password);
                if (newPasswordResponse.success) {
                    navigate('/account/');
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                setErrorMessage({ message: error.message });
                console.log(error);
            }
        }
    });
    return { errorMessage, onSubmit, loginState };
};
//# sourceMappingURL=use-login-box.js.map
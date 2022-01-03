import { __awaiter } from "tslib";
import { useContext, useState } from 'react';
import { AuthenticationServiceContext } from './authentication-service-context';
import { NavigationContext } from './navigation-context';
export var RegisterState;
(function (RegisterState) {
    RegisterState["DoRegister"] = "DoRegister";
    RegisterState["ConfirmMobile"] = "ConfirmMobile";
})(RegisterState || (RegisterState = {}));
const isRegister = (_data, state) => state === RegisterState.DoRegister;
const isConfirm = (_data, state) => state === RegisterState.ConfirmMobile;
const callRegister = (data, registerFunc) => __awaiter(void 0, void 0, void 0, function* () {
    const address = [
        data.addressLine1,
        data.addressLine2,
        data.county,
        data.townOrCity,
        data.postcode,
    ]
        .filter(Boolean)
        .join('\n');
    return registerFunc(data.username, data.password, data.saluation, data.email, data.firstName, data.surname, address, data.telephone);
});
export const useRegisterBox = () => {
    const { login, register, confirmSignup } = useContext(AuthenticationServiceContext);
    const { navigate } = useContext(NavigationContext);
    if (!login || !register || !confirmSignup || !navigate) {
        throw new Error('Dependencies not initailised properly!');
    }
    const [errorMessage, setErrorMessage] = useState();
    const [registerState, setRegisterState] = useState(RegisterState.DoRegister);
    const [registerData, setRegisterData] = useState();
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            if (isRegister(data, registerState)) {
                const result = yield callRegister(data, register);
                if (!result.userConfirmed) {
                    setRegisterState(RegisterState.ConfirmMobile);
                }
                setRegisterData(data);
            }
            else if (isConfirm(data, registerState)) {
                const result = yield confirmSignup((_a = registerData === null || registerData === void 0 ? void 0 : registerData.username) !== null && _a !== void 0 ? _a : '', data.code);
                if (result === 'SUCCESS') {
                    yield login((_b = registerData === null || registerData === void 0 ? void 0 : registerData.username) !== null && _b !== void 0 ? _b : '', (_c = registerData === null || registerData === void 0 ? void 0 : registerData.password) !== null && _c !== void 0 ? _c : '');
                    navigate('/account/');
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                setErrorMessage({ message: error.message });
            }
        }
    });
    return { errorMessage, registerState, onSubmit };
};
//# sourceMappingURL=use-register-box.js.map
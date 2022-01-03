import { __awaiter } from "tslib";
import { Fragment as _Fragment, jsx as _jsx } from "@emotion/react/jsx-runtime";
import { useContext, useEffect } from 'react';
import { NavigationContext } from './navigation-context';
export var Redirect;
(function (Redirect) {
    Redirect[Redirect["IfLoggedIn"] = 0] = "IfLoggedIn";
    Redirect[Redirect["IfLoggedOut"] = 1] = "IfLoggedOut";
})(Redirect || (Redirect = {}));
const Authenticated = (props) => {
    const { navigate } = useContext(NavigationContext);
    if (!navigate) {
        throw new Error('Dependencies have not been properly configured');
    }
    useEffect(() => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if ((!props.user && props.redirect === Redirect.IfLoggedOut) ||
                (props.user && props.redirect === Redirect.IfLoggedIn)) {
                navigate((_a = props.redirectPath) !== null && _a !== void 0 ? _a : '/login/');
            }
        }))();
    }, [props.redirectPath, props.redirect]);
    return _jsx(_Fragment, { children: props.children }, void 0);
};
export default Authenticated;
//# sourceMappingURL=authenticated.js.map
import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import LoginAndRegisterBoxComponent from './login-and-register-box';
export default {
    title: 'organisms/Login and Register Box',
    component: LoginAndRegisterBoxComponent,
    argTypes: { onLogin: { action: 'clicked', errors: { control: 'array' } } },
};
const Template = (args) => (_jsx(LoginAndRegisterBoxComponent, Object.assign({ defaultTab: "Login" }, args), void 0));
export const Main = Template.bind({});
Main.args = {
    errors: [],
};
export const WithErrors = Template.bind({});
WithErrors.args = {
    errors: [{ message: 'Incorrect Password' }],
};
//# sourceMappingURL=login-and-register-box.stories.js.map
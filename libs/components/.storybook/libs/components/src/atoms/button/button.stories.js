import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import ButtonComponent from './button';
export default {
    title: 'atoms/Button',
    component: ButtonComponent,
    argTypes: {
        primary: { name: 'Primary', type: 'boolean', defaultValue: false },
        color: { name: 'Color', type: 'string', defaultValue: undefined },
    },
};
const Template = (args) => (_jsx(ButtonComponent, Object.assign({}, args, { children: "Click Me" }), void 0));
export const Primary = Template.bind({});
Primary.args = {
    primary: true,
};
export const Secondary = Template.bind({});
Secondary.args = {
    primary: false,
};
//# sourceMappingURL=button.stories.js.map
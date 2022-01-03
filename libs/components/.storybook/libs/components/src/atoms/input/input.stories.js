import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import InputComponent from './input';
export default {
    title: 'atoms/Input',
    component: InputComponent,
};
const Template = (args) => _jsx(InputComponent, Object.assign({}, args), void 0);
export const Input = Template.bind({});
Input.args = {
    label: 'Some Field',
    value: '',
    error: false,
    placeholder: 'Enter something',
};
//# sourceMappingURL=input.stories.js.map
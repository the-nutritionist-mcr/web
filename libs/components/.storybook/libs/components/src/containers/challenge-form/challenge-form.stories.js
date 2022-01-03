import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import ChallengeFormComponent from './challenge-form';
export default {
    title: 'containers/Challenge Form',
    component: ChallengeFormComponent,
    argTypes: {
        errors: {
            control: 'array',
            table: {
                category: 'props',
            },
        },
    },
};
const Template = (args) => (_jsx(ChallengeFormComponent, Object.assign({}, args, { children: _jsx("p", { children: "Some content" }, void 0) }), void 0));
export const Main = Template.bind({});
Main.args = {};
export const WithErrors = Template.bind({});
WithErrors.args = {
    errors: [{ message: 'An error!' }],
};
//# sourceMappingURL=challenge-form.stories.js.map
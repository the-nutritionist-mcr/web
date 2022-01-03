import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import TabBoxComponent from './tab-box';
import Tab from './tab';
export default {
    title: 'containers/Tab Box',
    component: TabBoxComponent,
};
const Template = (args) => (_jsxs(TabBoxComponent, Object.assign({}, args, { children: [_jsx(Tab, Object.assign({ tabTitle: "Login" }, { children: _jsx("p", { children: "Contents of one" }, void 0) }), void 0), _jsx(Tab, Object.assign({ tabTitle: "Register" }, { children: _jsx("p", { children: "Contents of two" }, void 0) }), void 0)] }), void 0));
export const TabBox = Template.bind({});
//# sourceMappingURL=tab-box.stories.js.map
import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import MenuIcon from './menu.svg';
import IconButtonComponent from './icon-button';
export default {
    title: 'atoms/Icon Button',
    component: IconButtonComponent,
};
const Template = () => {
    return _jsx(IconButtonComponent, { a11yLabel: "Menu Button", icon: MenuIcon }, void 0);
};
export const IconButton = Template.bind({});
//# sourceMappingURL=icon-button.stories.js.map
import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { useState } from 'react';
import QuantityStepper from './quantity-stepper';
export default {
    title: 'molecules/Quantity Stepper',
    component: QuantityStepper,
};
const Template = (args) => {
    const [value, setValue] = useState(0);
    return (_jsx(QuantityStepper, Object.assign({ onChange: (newValue) => setValue(newValue), value: value }, args), void 0));
};
export const Stepper = Template.bind({});
Stepper.args = {
    min: 0,
    max: 4,
    label: '',
};
export const LabelledStepper = Template.bind({});
LabelledStepper.args = {
    min: 0,
    max: 4,
    label: 'A stepper with some text',
};
//# sourceMappingURL=quantity-stepper.stories.js.map
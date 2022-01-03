import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { useState } from 'react';
import MealCounterComponent from './meal-counter';
export default {
    title: 'organisms/Meal Selections/parts/Meal Counter',
    component: MealCounterComponent,
};
const Template = (args) => {
    const [value, setValue] = useState(0);
    return (_jsx(MealCounterComponent, Object.assign({ onChange: (newValue) => setValue(newValue), value: value }, args), void 0));
};
export const MealCounter = Template.bind({});
MealCounter.args = {
    title: 'French toast, fruit & yoghurt',
    description: 'French toast, fresh seasonal fruit, greek yoghurt and mint garnish',
    min: 0,
    max: 4,
};
//# sourceMappingURL=meal-counter.stories.js.map
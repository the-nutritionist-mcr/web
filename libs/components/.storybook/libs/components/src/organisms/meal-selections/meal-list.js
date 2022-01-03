import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import MealCounter from './meal-counter';
import styled from '@emotion/styled';
const FlexBox = styled.div `
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
`;
const MealList = (props) => {
    const total = Object.entries(props.selected).reduce((accum, item) => accum + item[1], 0);
    return (_jsx(FlexBox, { children: props.things.map((thing) => {
            let _a, _b;
            return (_jsx(MealCounter, { title: thing.title, description: thing.description, value: (_a = props.selected[thing.id]) !== null && _a !== void 0 ? _a : 0, min: 0, max: props.max - total + ((_b = props.selected[thing.id]) !== null && _b !== void 0 ? _b : 0), onChange: (newValue) => props.setSelected(Object.assign(Object.assign({}, props.selected), { [thing.id]: newValue })) }, thing.id));
        }) }, void 0));
};
export default MealList;
//# sourceMappingURL=meal-list.js.map
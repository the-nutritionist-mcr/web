import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { useState } from 'react';
import { TabBox, Tab } from '../../containers';
import MealList from './meal-list';
import TabButton from './tab-button';
import styled from '@emotion/styled';
import CombinedBasket from './combined-basket';
const GridParent = styled.div `
  display: grid;
  width: 100%;
  grid-template-columns: 70% 30%;
`;
const DivContainer = styled.div `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 2rem;
`;
const createDefaultSelectedThings = (things) => Object.fromEntries(things.map((thing) => [thing.id, 0]));
const MealSelections = (props) => {
    const [selectedMeals, setSelectedMeals] = useState(createDefaultSelectedThings(props.mealsAvailable));
    const [selectedBreakfasts, setSelectedBreakfasts] = useState(createDefaultSelectedThings(props.breakfastsAvailable));
    const [selectedSnacks, setSelectedSnacks] = useState(createDefaultSelectedThings(props.snacksAvailable));
    return (_jsx(DivContainer, { children: _jsxs(GridParent, { children: [_jsxs(TabBox, Object.assign({ tabButton: TabButton }, { children: [_jsx(Tab, Object.assign({ tabTitle: "Meals" }, { children: _jsx(MealList, { things: props.mealsAvailable, selected: selectedMeals, setSelected: setSelectedMeals, max: props.maxMeals }, void 0) }), void 0), _jsx(Tab, Object.assign({ tabTitle: "Breakfasts" }, { children: _jsx(MealList, { things: props.breakfastsAvailable, selected: selectedBreakfasts, setSelected: setSelectedBreakfasts, max: props.maxBreakfasts }, void 0) }), void 0), _jsx(Tab, Object.assign({ tabTitle: "Snacks" }, { children: _jsx(MealList, { things: props.snacksAvailable, selected: selectedSnacks, setSelected: setSelectedSnacks, max: props.maxSnacks }, void 0) }), void 0)] }), void 0), _jsx(CombinedBasket, { available: [
                        ...props.mealsAvailable,
                        ...props.snacksAvailable,
                        ...props.breakfastsAvailable,
                    ], selectedMeals: selectedMeals, setMeals: setSelectedMeals, selectedSnacks: selectedSnacks, setSnacks: setSelectedSnacks, selectedBreakfasts: selectedBreakfasts, setBreakfasts: setSelectedBreakfasts, maxMeals: props.maxMeals, maxSnacks: props.maxSnacks, maxBreakfasts: props.maxBreakfasts }, void 0)] }, void 0) }, void 0));
};
export default MealSelections;
//# sourceMappingURL=meal-selections.js.map
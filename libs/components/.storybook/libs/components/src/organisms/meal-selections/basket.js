import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { QuantityStepper } from '../../molecules';
import styled from '@emotion/styled';
const toTitleCase = (string) => {
    return string.replace(/\w\S*/g, (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    });
};
const BasketContainer = styled.div `
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;
const makeBasketItems = (selectedThings, available, setSelected, max, total) => Object.entries(selectedThings)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => (Object.assign(Object.assign({}, available.find((thing) => thing.id === id)), { count })))
    .map((thing) => {
    let _a, _b;
    return (_jsx(QuantityStepper, { label: thing.title, value: thing.count, max: max - total + ((_b = selectedThings[(_a = thing.id) !== null && _a !== void 0 ? _a : '']) !== null && _b !== void 0 ? _b : 0), onChange: (newValue) => { let _a; return setSelected(Object.assign(Object.assign({}, selectedThings), { [(_a = thing === null || thing === void 0 ? void 0 : thing.id) !== null && _a !== void 0 ? _a : '']: newValue })); } }, `${thing.id}-basket-item`));
});
const BasketHeader = styled.h3 `
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 1rem 0 0 0;
  padding: 0;
`;
const Basket = (props) => {
    const totalSelected = Object.entries(props.selectedMeals).reduce((accum, item) => accum + item[1], 0);
    if (totalSelected === 0) {
        return null;
    }
    const remaining = props.max - totalSelected;
    const BasketRemaining = styled.p `
    font-family: 'Acumin Pro', Arial, sans-serif;
    color: ${remaining === 0 ? `red` : `default`};
  `;
    const itemWord = totalSelected > 1 ? props.itemWordPlural : props.itemWord;
    const header = toTitleCase(`${totalSelected} ${itemWord} Selected`);
    return (_jsxs(BasketContainer, { children: [_jsx(BasketHeader, { children: header }, void 0), _jsxs(BasketRemaining, { children: [remaining, " ", itemWord, " remaining"] }, void 0), makeBasketItems(props.selectedMeals, props.available, props.setSelected, props.max, totalSelected)] }, void 0));
};
export default Basket;
//# sourceMappingURL=basket.js.map
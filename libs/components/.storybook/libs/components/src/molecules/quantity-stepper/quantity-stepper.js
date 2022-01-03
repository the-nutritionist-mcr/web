import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import AddIcon from './tnm-add.png';
import MinusIcon from './tnm-subtract.png';
import { IconButton } from '../../atoms';
import styled from '@emotion/styled';
import { uniqueId } from 'lodash';
import { Fragment } from 'react';
const StyledDiv = styled('div') `
  display: flex;
  gap: 0.1rem;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 30px;
  padding: 5px;
`;
const LabelText = styled.label `
  flex-grow: 999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Acumin Pro', Arial, sans-serif;
  padding-left: 0.5rem;
`;
const QuantityStepper = (props) => {
    let _a, _b;
    const CountLabel = styled('div') `
    font-family: 'Acumin Pro', Arial, sans-serif;
    font-weight: bold;
    flex-grow: ${props.label ? '0' : '999'};
    padding-left: ${props.label ? '0.5rem' : '0'};
    text-align: center;
  `;
    const minusDisabled = props.value !== undefined &&
        props.min !== undefined &&
        props.value === props.min;
    const plusDisabled = props.value !== undefined &&
        props.max !== undefined &&
        props.value === props.max;
    const minusButton = (_jsx(IconButton, { onClick: () => {
            let _a, _b;
            if (!minusDisabled) {
                (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, ((_b = props.value) !== null && _b !== void 0 ? _b : 0) - 1);
            }
        }, icon: MinusIcon, a11yLabel: "Decrease", disabled: minusDisabled }, void 0));
    const plusButton = (_jsx(IconButton, { onClick: () => {
            let _a, _b;
            if (!plusDisabled) {
                (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, ((_b = props.value) !== null && _b !== void 0 ? _b : 0) + 1);
            }
        }, icon: AddIcon, a11yLabel: "Increase", disabled: plusDisabled }, void 0));
    const labelId = uniqueId();
    const countLabel = (_jsx(CountLabel, Object.assign({ role: "spinbutton", "aria-valuenow": (_a = props.value) !== null && _a !== void 0 ? _a : 0, "aria-valuemin": props.min, "aria-valuemax": props.max, "aria-labelledby": labelId }, { children: (_b = props.value) !== null && _b !== void 0 ? _b : 0 }), void 0));
    const widgets = props.label ? (_jsxs(Fragment, { children: [countLabel, _jsx(LabelText, Object.assign({ id: labelId }, { children: props.label }), void 0), minusButton, plusButton] }, void 0)) : (_jsxs(Fragment, { children: [minusButton, countLabel, plusButton] }, void 0));
    return _jsx(StyledDiv, { children: widgets }, void 0);
};
export default QuantityStepper;
//# sourceMappingURL=quantity-stepper.js.map
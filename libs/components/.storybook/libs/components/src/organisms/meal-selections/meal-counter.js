import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { ParagraphText } from '../../atoms';
import { QuantityStepper } from '../../molecules';
import styled from '@emotion/styled';
import { uniqueId } from 'lodash';
const Header = styled.h3 `
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-size: 1.7rem;
  margin: 0;
`;
const Container = styled.section `
  display: flex;
  flex-direction: column;
  width: 20rem;
  text-align: center;
  align-items: center;
`;
const MealCounter = (props) => {
    let _a, _b, _c;
    const headerId = uniqueId();
    return (_jsxs(Container, Object.assign({ "aria-labelledby": headerId }, { children: [_jsx(Header, Object.assign({ id: headerId }, { children: props.title }), void 0), _jsx(ParagraphText, { children: props.description }, void 0), _jsx(QuantityStepper, { onChange: props.onChange, value: (_a = props.value) !== null && _a !== void 0 ? _a : 0, min: (_b = props.min) !== null && _b !== void 0 ? _b : 0, max: (_c = props.max) !== null && _c !== void 0 ? _c : 0 }, void 0)] }), void 0));
};
export default MealCounter;
//# sourceMappingURL=meal-counter.js.map
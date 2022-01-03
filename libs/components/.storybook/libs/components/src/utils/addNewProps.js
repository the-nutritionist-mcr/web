import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { recursiveTransform } from './recursiveTransform';
export const addNewProps = (nodes, newProps) => recursiveTransform(nodes, (element) => {
    return newProps(element).apply ? (_jsx(element.type, Object.assign({}, Object.assign(Object.assign({}, element.props), newProps(element).props)), void 0)) : (_jsx(element.type, Object.assign({}, element.props), void 0));
});
//# sourceMappingURL=addNewProps.js.map
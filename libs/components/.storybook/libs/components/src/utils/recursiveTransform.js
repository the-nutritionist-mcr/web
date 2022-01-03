import { isValidElement, Children } from 'react';
export const recursiveTransform = (nodes, func) => Children.map(nodes, (node) => {
    return isValidElement(node)
        ? func(Object.assign(Object.assign({}, node), { props: Object.assign(Object.assign({}, node.props), { children: recursiveTransform(node.props.children, func) }) }))
        : node;
});
//# sourceMappingURL=recursiveTransform.js.map
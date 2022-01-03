import { createElement } from 'react';
const Heading = (props) => {
    return createElement(`h${props.level}`, {}, props.children);
};
export default Heading;
//# sourceMappingURL=heading.js.map
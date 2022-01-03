import { FC, createElement } from 'react';

interface HeadingProps {
  level: number;
}

const Heading: FC<HeadingProps> = (props) => {
  return createElement(`h${props.level}`, {}, props.children);
};

export default Heading;

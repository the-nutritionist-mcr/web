import { createElement, ReactNode } from 'react';

interface HeadingProps {
  level: number;
  children: ReactNode;
}

const Heading = (props: HeadingProps) => {
  return createElement(`h${props.level}`, {}, props.children);
};

export default Heading;

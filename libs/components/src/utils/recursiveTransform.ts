import { isValidElement, ReactElement, ReactNode, Children } from 'react';

export const recursiveTransform = (
  nodes: ReactNode,
  func: (element: ReactElement) => ReactNode
): ReactNode =>
  Children.map(nodes, (node) => {
    return isValidElement(node)
      ? func({
          ...node,
          props: {
            ...node.props,
            children: recursiveTransform(node.props.children, func),
          },
        })
      : node;
  });

import { FC, ReactElement, ReactNode } from 'react';
import { recursiveTransform } from './recursiveTransform';

type PropsOf<P> = P extends FC<infer T> ? T : never;

interface AddNewPropsReturnVal<P> {
  props: Partial<PropsOf<P>>;
  apply?: boolean;
}

export const addNewProps = <P,>(
  nodes: ReactNode,
  newProps: (element: ReactElement) => AddNewPropsReturnVal<P>
) =>
  recursiveTransform(nodes, (element) => {
    return newProps(element).apply ? (
      <element.type {...{ ...element.props, ...newProps(element).props }} />
    ) : (
      <element.type {...element.props} />
    );
  });

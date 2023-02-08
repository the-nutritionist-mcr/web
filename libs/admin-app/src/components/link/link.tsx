import { useContext } from 'react';
import { NavigationContext } from '@tnmw/utils';
import NextLink from 'next/link';

interface LinkProps {
  children?: React.ReactNode;
  path: string;
}

export const Link = (props: LinkProps) => {
  const { navigate } = useContext(NavigationContext);
  return (
    <NextLink
      href={props.path}
      onClick={(event) => {
        navigate?.(props.path);
        event.preventDefault();
      }}
    >
      {props.children}
    </NextLink>
  );
};

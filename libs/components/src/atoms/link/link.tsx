import { useContext, useEffect } from 'react';
import { NavigationContext } from '@tnmw/utils';

interface LinkProps {
  children?: React.ReactNode;
  path: string;
  className?: string;
}

export const Link = (props: LinkProps) => {
  const { navigate, prefetch } = useContext(NavigationContext);
  useEffect(() => {
    prefetch?.(props.path);
  }, [prefetch, props.path]);

  return (
    <a
      className={props.className}
      href={props.path}
      onClick={(event) => {
        navigate?.(props.path);
        event.preventDefault();
      }}
    >
      {props.children}
    </a>
  );
};

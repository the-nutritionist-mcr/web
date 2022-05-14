import { useContext } from 'react';
import { NavigationContext } from '@tnmw/utils';

interface LinkProps {
  children?: React.ReactNode;
  path: string;
}

export const Link = (props: LinkProps) => {
  const { navigate } = useContext(NavigationContext);
  return (
    <a
      href={props.path}
      onClick={(event) => {
        navigate(props.path);
        event.preventDefault();
      }}
    >
      {props.children}
    </a>
  );
};

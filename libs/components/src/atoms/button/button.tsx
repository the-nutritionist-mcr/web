import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import type { FC, MouseEvent } from 'react';

export interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  primary?: boolean;
  color?: string;
}

const ButtonElement = styled.button((props: ButtonProps) => {
  const theme = useTheme();
  const color = props.color ?? theme.colors.buttonBlack;
  return {
    height: '100%',
    borderRadius: '25px',
    border: props.primary ? `1px solid ${color}` : 0,
    cursor: 'pointer',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    background: props.primary ? color : 'white',
    color: props.primary ? 'white' : color,
    lineHeight: '17px',
    fontSize: '16px',
    fontWeight: 700,
    padding: '10px 30px',
    textDecoration: props.primary ? 0 : 'underline',
    '&:hover': {
      color: props.primary ? color : 'white',
      backgroundColor: props.primary ? 'white' : color,
    },
  };
});

ButtonElement.displayName = 'button';

const Button: FC<ButtonProps> = (props) => (
  <ButtonElement {...props}>{props.children}</ButtonElement>
);

export default Button;

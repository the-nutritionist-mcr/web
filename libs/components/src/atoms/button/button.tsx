import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import type { FC, MouseEvent } from 'react';
import { Theme } from '@emotion/react';

type Size = 'medium' | 'large';

interface Measurements {
  lineHeight: string;
  fontSize: string;
  padding: string;
}

type SizeMap = {
  [k in Size]: Measurements;
};

export interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  primary?: boolean;
  color?: keyof Theme['colors'];
  disabled?: boolean;
  size?: Size;
  backgroundColor?: string;
}

const sizes: SizeMap = {
  medium: {
    lineHeight: '17px',
    fontSize: '16px',
    padding: '10px 30px',
  },

  large: {
    lineHeight: '17px',
    fontSize: '20px',
    padding: '15px 40px',
  },
};

const ButtonElement = styled.button((props: ButtonProps) => {
  const theme = useTheme();
  const color = theme.colors[props.color ?? 'buttonBlack'];
  const size = props.size ?? 'medium';
  const backgroundColor = props.primary ? color : 'white';

  return {
    height: '100%',
    borderRadius: '25px',
    border: props.primary ? `1px solid ${color}` : 0,
    cursor: 'pointer',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    background: backgroundColor,
    color: props.primary ? 'white' : color,
    lineHeight: sizes[size].lineHeight,
    fontSize: sizes[size].fontSize,
    fontWeight: 700,
    padding: sizes[size].padding,
    textDecoration: props.primary ? 0 : 'underline',
    '&:hover': {
      color: props.primary ? color : 'white',
      backgroundColor: props.primary ? 'white' : color,
    },
    '&:disabled': {
      color: 'grey',
      backgroundColor: 'white',
      border: `1px solid ${color}`,
    },
  };
});

ButtonElement.displayName = 'button';

const Button: FC<ButtonProps> = (props) => (
  <ButtonElement {...props}>{props.children}</ButtonElement>
);

export default Button;

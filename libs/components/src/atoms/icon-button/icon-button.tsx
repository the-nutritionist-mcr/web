import styled from '@emotion/styled';
import type { FC, MouseEvent } from 'react';

export interface IconButtonProps {
  icon: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  a11yLabel: string;
}

const StyledButton = styled('button')`
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 0;
  border: 0;
  background: 0;
  cursor: pointer;
  border-radius: 50%;

  &:disabled {
    cursor: default;
    opacity: 0.3;
  }

  &:hover:enabled {
    filter: opacity(50%);
  }
`;
StyledButton.displayName = 'button';

const VisuallyHiddenText = styled.span`
  position: absolute;
  overflow: hidden;
  margin: 0px;
  width: 1px;
  height: 1px;
  clip-path: inset(100%);
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
`;

const IconButton: FC<IconButtonProps> = (props) => (
  <StyledButton onClick={props.onClick} disabled={props.disabled}>
    <img src={props.icon} alt="" width="40px" height="40px" />
    <VisuallyHiddenText>{props.a11yLabel}</VisuallyHiddenText>
  </StyledButton>
);

export default IconButton;

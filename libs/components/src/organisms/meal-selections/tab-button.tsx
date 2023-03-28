import { ReactNode } from 'react';
import styled from '@emotion/styled';

interface MealsSelectionsTabButtonProps {
  onClick?: () => void;
  active?: boolean;
  tabListLength: number;
  children: ReactNode;
}

const MealsSelectionsTabButton = (props: MealsSelectionsTabButtonProps) => {
  const StyledButton = styled.button`
    font-family: acumin-pro-semi-condensed, Arial, sans-serif;
    min-width: 10rem;
    border: 0;
    cursor: pointer;
    padding: 1rem 3rem;
    text-align: center;
    font-size: 2rem;
    background: 0;
    color: ${props.active ? `black` : `#939393`};
    text-decoration: ${props.active ? `underline` : `none`};
  `;
  StyledButton.displayName = 'button';

  return (
    <StyledButton
      role="tab"
      onClick={props.onClick}
      aria-selected={props.active}
      className={props.active ? 'active' : undefined}
    >
      {props.children}
    </StyledButton>
  );
};

export default MealsSelectionsTabButton;

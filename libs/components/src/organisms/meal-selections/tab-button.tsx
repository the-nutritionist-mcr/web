import { FC } from 'react';
import styled from '@emotion/styled';

interface MealsSelectionsTabButtonProps {
  onClick?: () => void;
  active?: boolean;
  tabListLength: number;
}

const MealsSelectionsTabButton: FC<MealsSelectionsTabButtonProps> = (props) => {
  const StyledButton = styled.button`
    font-family: 'Acumin Pro', Arial, sans-serif;
    width: calc(100% / ${props.tabListLength});
    margin: 0 0 1rem 0;
    border: 0;
    cursor: pointer;
    padding: 1rem 3rem;
    font-size: 2rem;
    background: white;
    color: ${props.active ? `black` : `#939393`};
    text-decoration: ${props.active ? `underline` : `none`};
  `;
  StyledButton.displayName = 'button';

  return (
    <StyledButton
      role="tab"
      onClick={props.onClick}
      aria-selected={props.active}
    >
      {props.children}
    </StyledButton>
  );
};

export default MealsSelectionsTabButton;

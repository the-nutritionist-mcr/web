import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

interface TabButtonProps {
  onClick?: () => void;
  active?: boolean;
  tabListLength: number;
  children: ReactNode;
}

const TabButton: FC<TabButtonProps> = (props) => {
  const StyledButton = styled.button`
    font-family: acumin-pro-semi-condensed, Arial, sans-serif;
    font-weight: bold;
    width: calc(100% / ${props.tabListLength});
    margin: 0;
    cursor: pointer;
    padding: 1rem 3rem;
    font-size: 2rem;
    color: black;
    background: ${props.active ? 'white' : '#E3E3E3'};
    border-bottom: ${props.active ? '0' : '1px solid black'};
    border-top: 0;
    border-left: 0;
    border-right: 0;

    &:not(:first-of-type) {
      border-left: 1px solid black;
    }
    /* stylelint-disable */
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

export default TabButton;

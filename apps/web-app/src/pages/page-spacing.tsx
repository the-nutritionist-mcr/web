import styled from '@emotion/styled';
import { ReactNode } from 'react';

const Container = styled.section`
  padding-top: 3rem;
  display: flex;
  width: 100%;
  padding: 0 auto;
  align-items: center;
  flex-direction: column;
`;

interface PageSpacingProps {
  children: ReactNode;
}

export const PageSpacing = (props: PageSpacingProps) => (
  <Container>{props.children}</Container>
);
